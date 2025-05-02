import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../common/Loader';
import visualizationsApi from '../../api/visualizationsApi';

interface NetworkComparisonChartProps {
  className?: string;
}

const NetworkComparisonChart: React.FC<NetworkComparisonChartProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [networkData, setNetworkData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await visualizationsApi.getReliabilityByNetwork();
        setNetworkData(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching network comparison data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`network-comparison ${className}`}>
        <Loader size="small" text={t('reliability.loadingNetworkData')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`network-comparison network-comparison--error ${className}`}>
        <p>{t('reliability.errorLoadingNetworkData')}</p>
      </div>
    );
  }

  // Transform API data to chart-friendly format
  const chartData = networkData.map(item => ({
    label: item.networkName,
    value: item.averageReliability,
    color: getColorForScore(item.averageReliability),
    count: item.stationCount
  }));

  return (
    <div className={`network-comparison ${className}`}>
      <h3 className="network-comparison__title">
        {t('reliability.networkComparison')}
      </h3>
      
      <div className="network-comparison__chart">
        {chartData.map((network, index) => (
          <div key={index} className="network-comparison__item">
            <div className="network-comparison__network">
              <span className="network-comparison__name">{network.label}</span>
              <span className="network-comparison__count">
                ({t('reliability.stationCount', { count: network.count })})
              </span>
            </div>
            
            <div className="network-comparison__bar-container">
              <div 
                className="network-comparison__bar"
                style={{ 
                  width: `${network.value}%`,
                  backgroundColor: network.color
                }}
              ></div>
              <span className="network-comparison__score">{network.value.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get color based on reliability score
const getColorForScore = (score: number): string => {
  if (score >= 90) return '#27ae60'; // Excellent
  if (score >= 80) return '#2ecc71'; // Very good
  if (score >= 70) return '#f39c12'; // Good
  if (score >= 50) return '#e67e22'; // Fair
  return '#e74c3c';                  // Poor
};

export default NetworkComparisonChart;