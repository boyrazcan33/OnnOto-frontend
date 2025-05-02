import React from 'react';
import { useTranslation } from 'react-i18next';

interface DirectionsButtonProps {
  latitude: number;
  longitude: number;
  stationName: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const DirectionsButton: React.FC<DirectionsButtonProps> = ({
  latitude,
  longitude,
  stationName,
  size = 'medium',
  className = '',
}) => {
  const { t } = useTranslation();

  const getDirectionsUrl = () => {
    // Try to use platform-specific maps
    if (navigator.platform.indexOf('iPhone') !== -1 || 
        navigator.platform.indexOf('iPad') !== -1 || 
        navigator.platform.indexOf('iPod') !== -1) {
      return `https://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
    } else {
      // Default to Google Maps
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${encodeURIComponent(stationName)}`;
    }
  };

  const handleClick = () => {
    window.open(getDirectionsUrl(), '_blank');
  };

  return (
    <button
      className={`directions-button directions-button--${size} ${className}`}
      onClick={handleClick}
      aria-label={t('stations.getDirections')}
      title={t('stations.getDirections')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
      </svg>
    </button>
  );
};

export default DirectionsButton;