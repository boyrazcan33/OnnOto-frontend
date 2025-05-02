import React from 'react';
import { useTranslation } from 'react-i18next';
import { StationDetail } from '../../types/station';
import ConnectorsList from './ConnectorsList';
import StationReliabilityScore from './StationReliabilityScore';
import FavoriteButton from './FavoriteButton';
import DirectionsButton from './DirectionsButton';
import { formatDateTime } from '../../utils/formatters';

interface StationDetailsProps {
  station: StationDetail;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onReportIssue: () => void;
  className?: string;
}

const StationDetails: React.FC<StationDetailsProps> = ({
  station,
  isFavorite,
  onToggleFavorite,
  onReportIssue,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className={`station-details ${className}`}>
      <div className="station-details__header">
        <div className="station-details__title-container">
          <h1 className="station-details__title">{station.name}</h1>
          <div className="station-details__network">{station.networkName}</div>
        </div>
        
        <div className="station-details__actions">
          <FavoriteButton
            stationId={station.id}
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            size="large"
          />
          
          <DirectionsButton
            latitude={Number(station.latitude)}
            longitude={Number(station.longitude)}
            stationName={station.name}
            size="large"
          />
        </div>
      </div>
      
      <div className="station-details__info-section">
        <div className="station-details__address">
          <div className="station-details__address-line">
            {station.address}
          </div>
          <div className="station-details__address-line">
            {station.postalCode} {station.city}, {station.country}
          </div>
        </div>
        
        <div className="station-details__meta">
          <div className="station-details__meta-item">
            <span className="station-details__meta-label">
              {t('stations.operator')}:
            </span>
            <span className="station-details__meta-value">
              {station.operatorName}
            </span>
          </div>
          
          <div className="station-details__meta-item">
            <span className="station-details__meta-label">
              {t('stations.connectors')}:
            </span>
            <span className="station-details__meta-value">
              {station.availableConnectors} / {station.totalConnectors} {t('stations.available')}
            </span>
          </div>
          
          <div className="station-details__meta-item">
            <span className="station-details__meta-label">
              {t('stations.lastUpdate')}:
            </span>
            <span className="station-details__meta-value">
              {formatDateTime(station.lastStatusUpdate)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="station-details__reliability">
        <div className="station-details__reliability-header">
          <h2 className="station-details__section-title">
            {t('stations.reliability')}
          </h2>
          
          <StationReliabilityScore
            score={station.reliabilityScore}
            size="large"
            showStars={true}
          />
        </div>
        
        {station.reliability && (
          <div className="station-details__reliability-stats">
            <div className="station-details__reliability-item">
              <span className="station-details__reliability-label">
                {t('reliability.uptime')}:
              </span>
              <span className="station-details__reliability-value">
                {station.reliability.uptimePercentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="station-details__reliability-item">
              <span className="station-details__reliability-label">
                {t('reliability.reportCount')}:
              </span>
              <span className="station-details__reliability-value">
                {station.reliability.reportCount}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="station-details__connectors">
        <h2 className="station-details__section-title">
          {t('stations.connectors')}
        </h2>
        <ConnectorsList connectors={station.connectors} />
      </div>
      
      <div className="station-details__report-section">
        <button
          className="station-details__report-button"
          onClick={onReportIssue}
        >
          {t('stations.reportIssue')}
        </button>
      </div>
    </div>
  );
};

export default StationDetails;