import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../common/Loader';
import { AnomalyType } from '../../types/reliability';
import { formatDateTime } from '../../utils/formatters';

interface AnomalyListProps {
  stationId: string;
  limit?: number;
  showResolved?: boolean;
  className?: string;
}

// Placeholder anomaly data - in a real implementation, you would fetch from API
const mockAnomalies: AnomalyType[] = [
  {
    id: 1,
    stationId: 'station-1',
    stationName: 'Test Station',
    anomalyType: 'STATUS_FLAPPING',
    description: 'Connector has changed status 8 times in the last 24 hours',
    severity: 'MEDIUM',
    severityScore: 8.5,
    resolved: false,
    detectedAt: new Date().toISOString(),
  },
  {
    id: 2,
    stationId: 'station-1',
    stationName: 'Test Station',
    anomalyType: 'EXTENDED_DOWNTIME',
    description: 'Connector has been offline for 36 hours',
    severity: 'HIGH',
    severityScore: 9.2,
    resolved: false,
    detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const AnomalyList: React.FC<AnomalyListProps> = ({
  stationId,
  limit = 5,
  showResolved = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const [anomalies, setAnomalies] = useState<AnomalyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      // Filter mockAnomalies by stationId and resolved status
      const filteredAnomalies = mockAnomalies
        .filter(a => a.stationId === stationId && (showResolved || !a.resolved))
        .slice(0, limit);
      
      setAnomalies(filteredAnomalies);
      setLoading(false);
    }, 1000);
  }, [stationId, limit, showResolved]);

  if (loading) {
    return (
      <div className={`anomaly-list ${className}`}>
        <Loader size="small" text={t('anomalies.loading')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`anomaly-list anomaly-list--error ${className}`}>
        <p>{t('anomalies.errorLoading')}</p>
      </div>
    );
  }

  if (anomalies.length === 0) {
    return (
      <div className={`anomaly-list anomaly-list--empty ${className}`}>
        <p>{t('anomalies.noAnomalies')}</p>
      </div>
    );
  }

  return (
    <div className={`anomaly-list ${className}`}>
      {anomalies.map(anomaly => (
        <div
          key={anomaly.id}
          className={`anomaly-item anomaly-item--${anomaly.severity.toLowerCase()} ${anomaly.resolved ? 'anomaly-item--resolved' : ''}`}
        >
          <div className="anomaly-item__header">
            <div className="anomaly-item__type">
              {t(`anomalies.types.${anomaly.anomalyType.toLowerCase()}`)}
            </div>
            <div className="anomaly-item__severity">
              {t(`anomalies.severity.${anomaly.severity.toLowerCase()}`)}
            </div>
          </div>
          
          <div className="anomaly-item__description">
            {anomaly.description}
          </div>
          
          <div className="anomaly-item__footer">
            <div className="anomaly-item__time">
              {formatDateTime(anomaly.detectedAt)}
            </div>
            
            {anomaly.resolved && (
              <div className="anomaly-item__resolved-badge">
                {t('anomalies.resolved')}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnomalyList;