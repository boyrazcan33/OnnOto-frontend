import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Dropdown from '../components/common/Dropdown';
import Switch from '../components/common/Switch';
import Loader from '../components/common/Loader';
import ReliabilityChart from '../components/reliability/ReliabilityChart';
import NetworkComparisonChart from '../components/reliability/NetworkComparisonChart';
import AnomalyTrendsChart from '../components/reliability/AnomalyTrendsChart';
import AnomalyList from '../components/reliability/AnomalyList';
import StationList from '../components/stations/StationList';
import useReliabilityDashboard from '../hooks/useReliabilityDashboard';
import { Station } from '../types/station';

const ReliabilityDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // State for filters
  const [timeRange, setTimeRange] = useState('30');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [showProblematicOnly, setShowProblematicOnly] = useState(false);
  
  // Use the reliability dashboard hook
  const {
    loading,
    error,
    distributionData: reliabilityDistribution,
    anomalyTrendsData,
    reliableStations: mostReliableStations,
    problematicStations: problemStations,
    refreshData
  } = useReliabilityDashboard({
    days: parseInt(timeRange),
    cityFilter: selectedCity,
    networkFilter: selectedNetwork,
    showProblematicOnly
  });

  // Filter options
  const timeRangeOptions = [
    { value: '7', label: t('reliability.last7Days') },
    { value: '30', label: t('reliability.last30Days') },
    { value: '90', label: t('reliability.last90Days') }
  ];
  
  const cityOptions = [
    { value: '', label: t('filters.allCities') },
    { value: 'Tallinn', label: 'Tallinn' },
    { value: 'Tartu', label: 'Tartu' },
    { value: 'Pärnu', label: 'Pärnu' }
  ];
  
  const networkOptions = [
    { value: '', label: t('filters.allNetworks') },
    { value: 'elmo', label: 'ELMO' },
    { value: 'eleport', label: 'Eleport' },
    { value: 'virta', label: 'Virta' }
  ];

  // Update filters when UI elements change
  useEffect(() => {
    // The refreshData function is now handled by the hook
    // We just need to update the filters in state
  }, [timeRange, selectedCity, selectedNetwork, showProblematicOnly]);

  // Handle navigation to station detail
  const handleStationClick = (station: Station) => {
    navigate(`/station/${station.id}`);
  };

  // Format distribution data for chart
  const formatDistributionData = (data: any) => {
    if (!data || !data.data) return [];
    
    return [
      { range: "90-100", label: t('reliability.excellent'), count: data.data['90-100'] || 0, color: '#27ae60' },
      { range: "80-89", label: t('reliability.good'), count: data.data['80-89'] || 0, color: '#2ecc71' },
      { range: "70-79", label: t('reliability.moderate'), count: data.data['70-79'] || 0, color: '#f39c12' },
      { range: "60-69", label: t('reliability.fair'), count: data.data['60-69'] || 0, color: '#e67e22' },
      { range: "0-59", label: t('reliability.poor'), count: data.data['0-49'] || 0, color: '#e74c3c' }
    ];
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="reliability-dashboard__loading">
          <Loader text={t('reliability.loadingData')} />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="reliability-dashboard__error">
          <h1>{t('reliability.errorLoading')}</h1>
          <p>{error.message}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="reliability-dashboard">
        <div className="reliability-dashboard__header">
          <h1 className="reliability-dashboard__title">{t('reliability.dashboardTitle')}</h1>
          
          <div className="reliability-dashboard__filters">
            <div className="reliability-dashboard__filter">
              <label>{t('reliability.timeRange')}</label>
              <Dropdown
                options={timeRangeOptions}
                value={timeRange}
                onChange={setTimeRange}
              />
            </div>
            
            <div className="reliability-dashboard__filter">
              <label>{t('filters.city')}</label>
              <Dropdown
                options={cityOptions}
                value={selectedCity}
                onChange={setSelectedCity}
              />
            </div>
            
            <div className="reliability-dashboard__filter">
              <label>{t('filters.network')}</label>
              <Dropdown
                options={networkOptions}
                value={selectedNetwork}
                onChange={setSelectedNetwork}
              />
            </div>
            
            <div className="reliability-dashboard__filter">
              <Switch
                checked={showProblematicOnly}
                onChange={setShowProblematicOnly}
                label={t('reliability.showProblematicOnly')}
              />
            </div>
          </div>
        </div>
        
        <div className="reliability-dashboard__content">
          <div className="reliability-dashboard__row">
            <Card className="reliability-dashboard__card reliability-dashboard__card--half">
              <h2 className="reliability-dashboard__card-title">{t('reliability.distributionTitle')}</h2>
              <ReliabilityChart 
                data={formatDistributionData(reliabilityDistribution)}
              />
            </Card>
            
            <Card className="reliability-dashboard__card reliability-dashboard__card--half">
              <h2 className="reliability-dashboard__card-title">{t('reliability.networkComparisonTitle')}</h2>
              <NetworkComparisonChart />
            </Card>
          </div>
          
          <div className="reliability-dashboard__row">
            <Card className="reliability-dashboard__card reliability-dashboard__card--full">
              <h2 className="reliability-dashboard__card-title">{t('reliability.anomalyTrendsTitle')}</h2>
              {anomalyTrendsData ? (
                <AnomalyTrendsChart data={anomalyTrendsData} />
              ) : (
                <div className="reliability-dashboard__anomaly-chart">
                  <p>{t('reliability.noAnomalyData')}</p>
                </div>
              )}
            </Card>
          </div>
          
          <div className="reliability-dashboard__row">
            <Card className="reliability-dashboard__card reliability-dashboard__card--half">
              <h2 className="reliability-dashboard__card-title">{t('reliability.mostReliableTitle')}</h2>
              <StationList
                stations={mostReliableStations}
                onStationClick={handleStationClick}
                emptyMessage={t('reliability.noStationsFound')}
              />
            </Card>
            
            <Card className="reliability-dashboard__card reliability-dashboard__card--half">
              <h2 className="reliability-dashboard__card-title">{t('reliability.problemStationsTitle')}</h2>
              <StationList
                stations={problemStations}
                onStationClick={handleStationClick}
                emptyMessage={t('reliability.noStationsFound')}
              />
            </Card>
          </div>
          
          <div className="reliability-dashboard__row">
            <Card className="reliability-dashboard__card reliability-dashboard__card--full">
              <h2 className="reliability-dashboard__card-title">{t('reliability.recentAnomaliesTitle')}</h2>
              <AnomalyList stationId="" limit={10} />
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReliabilityDashboardPage;