import React from 'react';
import { Station } from '../../types/station';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { formatReliabilityScore } from '../../utils/formatters';

interface InfoWindowProps {
  station: Station;
  onClose: () => void;
}

const InfoWindow: React.FC<InfoWindowProps> = ({ station, onClose }) => {
  const { t } = useTranslation();
  const reliabilityData = formatReliabilityScore(station.reliabilityScore);

  return (
    <div className="info-window">
      <button className="info-window__close-button" onClick={onClose} aria-label={t('common.close')}>
        &times;
      </button>

      <h3 className="info-window__title">{station.name}</h3>
      
      <div className="info-window__network">{station.networkName}</div>
      
      <div className="info-window__address">{station.address}, {station.city}</div>
      
      <div className="info-window__status">
        <div className="info-window__connectors">
          <span className="info-window__available">{station.availableConnectors}</span>
          /
          <span className="info-window__total">{station.totalConnectors}</span>
          &nbsp;{t('stations.availableConnectors')}
        </div>
      </div>
      
      <div className="info-window__reliability" style={{ color: reliabilityData.color }}>
        <span className="info-window__reliability-score">{reliabilityData.value}</span>
        <span className="info-window__reliability-symbol">{reliabilityData.symbol}</span>
      </div>
      
      <div className="info-window__actions">
        <Link to={`/station/${station.id}`} className="info-window__details-link">
          {t('stations.viewDetails')}
        </Link>
      </div>
    </div>
  );
};

export default InfoWindow;