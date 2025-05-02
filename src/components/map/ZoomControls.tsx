import React from 'react';
import { useTranslation } from 'react-i18next';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  className?: string;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className={`zoom-controls ${className}`}>
      <button
        className="zoom-controls__button zoom-controls__button--in"
        onClick={onZoomIn}
        aria-label={t('map.zoomIn')}
        title={t('map.zoomIn')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      <button
        className="zoom-controls__button zoom-controls__button--out"
        onClick={onZoomOut}
        aria-label={t('map.zoomOut')}
        title={t('map.zoomOut')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

export default ZoomControls;