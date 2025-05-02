import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';
import ConnectorsList from '../components/stations/ConnectorsList';
import StationReliabilityScore from '../components/stations/StationReliabilityScore';
import FavoriteButton from '../components/stations/FavoriteButton';
import DirectionsButton from '../components/stations/DirectionsButton';
import StatusHistoryGraph from '../components/reliability/StatusHistoryGraph';
import AnomalyList from '../components/reliability/AnomalyList';
import ReportsList from '../components/reports/ReportsList';
import Loader from '../components/common/Loader';
import { StationDetail } from '../types/station';
import stationsApi from '../api/stationsApi';
import connectorsApi from '../api/connectorsApi';
import { formatDateTime } from '../utils/formatters';
import useStations from '../hooks/useStations';

const StationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useStations();
  
  const [station, setStation] = useState<StationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch station details
  useEffect(() => {
    const fetchStationDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        const stationData = await stationsApi.getStationById(id);
        setStation(stationData);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching station details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStationDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleReportIssue = () => {
    if (id) {
      navigate(`/report/${id}`);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="station-details-page__loading">
          <Loader text={t('stations.loading')} />
        </div>
      </MainLayout>
    );
  }

  if (error || !station) {
    return (
      <MainLayout>
        <div className="station-details-page__error">
          <h1>{t('stations.errorLoading')}</h1>
          <p>{error?.message || t('stations.stationNotFound')}</p>
          <Button variant="outline" onClick={handleBack}>
            {t('common.back')}
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="station-details-page">
        <div className="station-details-page__header">
          <button
            className="station-details-page__back-button"
            onClick={handleBack}
            aria-label={t('common.back')}
          >
            ←
          </button>
          
          <div className="station-details-page__title-container">
            <h1 className="station-details-page__title">{station.name}</h1>
            <div className="station-details-page__network">{station.networkName}</div>
          </div>
          
          <div className="station-details-page__actions">
            <FavoriteButton
              stationId={station.id}
              isFavorite={isFavorite(station.id)}
              onToggle={() => toggleFavorite(station.id)}
            />
            <DirectionsButton
              latitude={Number(station.latitude)}
              longitude={Number(station.longitude)}
              stationName={station.name}
            />
          </div>
        </div>
        
        <div className="station-details-page__content">
          <div className="station-details-page__main">
            <div className="station-details-page__info-card">
              <div className="station-details-page__info-header">
                <h2 className="station-details-page__section-title">
                  {t('stations.information')}
                </h2>
                
                <div className="station-details-page__reliability">
                  <StationReliabilityScore
                    score={station.reliabilityScore}
                    size="large"
                    showStars={true}
                  />
                </div>
              </div>
              
              <div className="station-details-page__info-content">
                <div className="station-details-page__address">
                  <div className="station-details-page__address-line">
                    {station.address}
                  </div>
                  <div className="station-details-page__address-line">
                    {station.postalCode} {station.city}, {station.country}
                  </div>
                </div>
                
                <div className="station-details-page__meta">
                  <div className="station-details-page__meta-item">
                    <span className="station-details-page__meta-label">
                      {t('stations.operator')}:
                    </span>
                    <span className="station-details-page__meta-value">
                      {station.operatorName}
                    </span>
                  </div>
                  
                  <div className="station-details-page__meta-item">
                    <span className="station-details-page__meta-label">
                      {t('stations.connectors')}:
                    </span>
                    <span className="station-details-page__meta-value">
                      {station.availableConnectors} / {station.totalConnectors} {t('stations.available')}
                    </span>
                  </div>
                  
                  <div className="station-details-page__meta-item">
                    <span className="station-details-page__meta-label">
                      {t('stations.lastUpdate')}:
                    </span>
                    <span className="station-details-page__meta-value">
                      {formatDateTime(station.lastStatusUpdate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="station-details-page__connectors">
              <h2 className="station-details-page__section-title">
                {t('stations.connectors')}
              </h2>
              <ConnectorsList connectors={station.connectors} />
            </div>
            
            <div className="station-details-page__history">
              <h2 className="station-details-page__section-title">
                {t('stations.statusHistory')}
              </h2>
              <StatusHistoryGraph stationId={station.id} />
            </div>
            
            <div className="station-details-page__reliability-card">
              <h2 className="station-details-page__section-title">
                {t('stations.reliabilityDetails')}
              </h2>
              
              {station.reliability ? (
                <div className="station-details-page__reliability-details">
                  <div className="station-details-page__reliability-item">
                    <span className="station-details-page__reliability-label">
                      {t('reliability.uptime')}:
                    </span>
                    <span className="station-details-page__reliability-value">
                      {station.reliability.uptimePercentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="station-details-page__reliability-item">
                    <span className="station-details-page__reliability-label">
                      {t('reliability.reportCount')}:
                    </span>
                    <span className="station-details-page__reliability-value">
                      {station.reliability.reportCount}
                    </span>
                  </div>
                  
                  <div className="station-details-page__reliability-item">
                    <span className="station-details-page__reliability-label">
                      {t('reliability.downtimeFrequency')}:
                    </span>
                    <span className="station-details-page__reliability-value">
                      {station.reliability.downtimeFrequency?.toFixed(1) || '-'}
                    </span>
                  </div>
                  
                  <div className="station-details-page__reliability-item">
                    <span className="station-details-page__reliability-label">
                      {t('reliability.dataPoints')}:
                    </span>
                    <span className="station-details-page__reliability-value">
                      {station.reliability.sampleSize}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="station-details-page__no-data">
                  {t('reliability.noDataAvailable')}
                </div>
              )}
            </div>
          </div>
          
          <div className="station-details-page__sidebar">
            <div className="station-details-page__report-section">
              <h2 className="station-details-page__section-title">
                {t('reports.title')}
              </h2>
              <ReportsList stationId={station.id} limit={5} />
              
              <div className="station-details-page__report-button">
                <Button
                  variant="primary"
                  onClick={handleReportIssue}
                  fullWidth
                >
                  {t('reports.reportIssue')}
                </Button>
              </div>
            </div>
            
            <div className="station-details-page__anomalies-section">
              <h2 className="station-details-page__section-title">
                {t('anomalies.title')}
              </h2>
              <AnomalyList stationId={station.id} limit={5} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StationDetailsPage;