import React from 'react';
import { Station } from '../../types/station';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { formatReliabilityScore } from '../../utils/formatters';

interface InfoWindowProps {
  station: Station;
  onClose: (e: React.MouseEvent) => void;
}

const InfoWindow: React.FC<InfoWindowProps> = ({ station, onClose }) => {
  const { t } = useTranslation();
  const reliabilityData = formatReliabilityScore(station.reliabilityScore);

  const handleClose = (e: React.MouseEvent) => {
    // Stop event propagation to prevent it from bubbling up
    e.stopPropagation();
    onClose(e);
  };

  return (
    <div className="info-window" onClick={(e) => e.stopPropagation()}>
      <button 
        className="info-window__close-button" 
        onClick={handleClose} 
        aria-label={t('common.close')}
      >
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
        <Link 
          to={`/station/${station.id}`} 
          className="info-window__details-link"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the link
        >
          {t('stations.viewDetails')}
        </Link>
      </div>
    </div>
  );
};

export default InfoWindow;