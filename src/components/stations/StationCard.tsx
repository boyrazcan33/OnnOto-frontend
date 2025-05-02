import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import { Station } from '../../types/station';
import { formatReliabilityScore, formatDateTime } from '../../utils/formatters';
import { CONNECTOR_STATUS, STATUS_COLORS } from '../../constants/statusTypes';
import useStations from '../../hooks/useStations';

interface StationCardProps {
  station: Station;
  showDetails?: boolean;
  onClick?: () => void;
}

const StationCard: React.FC<StationCardProps> = ({
  station,
  showDetails = true,
  onClick
}) => {
  const { t } = useTranslation();
  const { toggleFavorite, isFavorite } = useStations();
  const reliabilityData = formatReliabilityScore(station.reliabilityScore);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(station.id);
  };

  return (
    <Card
      className="station-card"
      hoverable
      onClick={onClick || (() => {})}
    >
      <div className="station-card__header">
        <div className="station-card__title-container">
          <h3 className="station-card__title">{station.name}</h3>
          <div className="station-card__network">{station.networkName}</div>
        </div>
        <button
          className={`station-card__favorite ${isFavorite(station.id) ? 'station-card__favorite--active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite(station.id) ? t('stations.removeFromFavorites') : t('stations.addToFavorites')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFavorite(station.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
        </button>
      </div>

      <div className="station-card__content">
        <div className="station-card__address">
          {station.address}, {station.city}
        </div>

        <div className="station-card__connectors">
          <div className="station-card__availability">
            <div className="station-card__available-count">{station.availableConnectors}</div>
            <div className="station-card__available-label">{t('stations.available')}</div>
          </div>
          <div className="station-card__connector-count">
            <span className="station-card__count-text">
              {t('stations.ofTotal', { total: station.totalConnectors })}
            </span>
          </div>
        </div>

        <div className="station-card__reliability" style={{ color: reliabilityData.color }}>
          <div className="station-card__reliability-score">{reliabilityData.value}</div>
          <div className="station-card__reliability-stars">{reliabilityData.symbol}</div>
        </div>

        {station.lastStatusUpdate && (
          <div className="station-card__last-update">
            {t('stations.lastUpdate')}: {formatDateTime(station.lastStatusUpdate)}
          </div>
        )}
      </div>

      {showDetails && (
        <div className="station-card__footer">
          <Link to={`/station/${station.id}`} className="station-card__details-link">
            {t('stations.viewDetails')}
          </Link>
        </div>
      )}
    </Card>
  );
};

export default StationCard;