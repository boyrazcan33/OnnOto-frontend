import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STATUS_COLORS } from '../../constants/statusTypes';

interface MapLegendProps {
  className?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const toggleLegend = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`map-legend ${expanded ? 'map-legend--expanded' : ''} ${className}`}>
      <button 
        className="map-legend__toggle"
        onClick={toggleLegend}
        aria-expanded={expanded}
        aria-label={expanded ? t('map.hideLegend') : t('map.showLegend')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
      </button>
      
      {expanded && (
        <div className="map-legend__content">
          <h3 className="map-legend__title">{t('map.legend')}</h3>
          <ul className="map-legend__list">
            <li className="map-legend__item">
              <span 
                className="map-legend__color"
                style={{ backgroundColor: STATUS_COLORS.AVAILABLE }}
              ></span>
              <span className="map-legend__label">{t('common.available')}</span>
            </li>
            <li className="map-legend__item">
              <span 
                className="map-legend__color"
                style={{ backgroundColor: STATUS_COLORS.OCCUPIED }}
              ></span>
              <span className="map-legend__label">{t('common.occupied')}</span>
            </li>
            <li className="map-legend__item">
              <span 
                className="map-legend__color"
                style={{ backgroundColor: STATUS_COLORS.OFFLINE }}
              ></span>
              <span className="map-legend__label">{t('common.offline')}</span>
            </li>
            <li className="map-legend__item">
              <span 
                className="map-legend__color"
                style={{ backgroundColor: STATUS_COLORS.UNKNOWN }}
              ></span>
              <span className="map-legend__label">{t('common.unknown')}</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapLegend;