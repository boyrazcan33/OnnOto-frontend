import React from 'react';
import { useTranslation } from 'react-i18next';
import { AnomalyType } from '../../types/reliability';
import Card from '../common/Card';
import { formatDateTime } from '../../utils/formatters';

interface AnomalyCardProps {
  anomaly: AnomalyType;
  onClick?: () => void;
  className?: string;
}

const AnomalyCard: React.FC<AnomalyCardProps> = ({
  anomaly,
  onClick,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <Card 
      className={`anomaly-card ${className}`}
      onClick={onClick}
      hoverable={!!onClick}
    >
      <div className={`anomaly-card__status anomaly-card__status--${anomaly.severity.toLowerCase()}`}>
        <div className="anomaly-card__severity">
          {t(`anomalies.severity.${anomaly.severity.toLowerCase()}`)}
        </div>
        
        {anomaly.resolved && (
          <div className="anomaly-card__resolved">
            {t('anomalies.resolved')}
          </div>
        )}
      </div>
      
      <div className="anomaly-card__header">
        <div className="anomaly-card__type">
          {t(`anomalies.types.${anomaly.anomalyType.toLowerCase()}`)}
        </div>
        <div className="anomaly-card__station">
          {anomaly.stationName}
        </div>
      </div>
      
      <div className="anomaly-card__description">
        {anomaly.description}
      </div>
      
      <div className="anomaly-card__footer">
        <div className="anomaly-card__time">
          {formatDateTime(anomaly.detectedAt)}
        </div>
        
        <div className="anomaly-card__score">
          {t('anomalies.severityScore')}: {anomaly.severityScore}
        </div>
      </div>
    </Card>
  );
};

export default AnomalyCard;