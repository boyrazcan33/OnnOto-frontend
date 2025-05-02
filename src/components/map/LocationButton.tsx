import React from 'react';
import { useTranslation } from 'react-i18next';

interface LocationButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const LocationButton: React.FC<LocationButtonProps> = ({
  onClick,
  className = '',
  disabled = false
}) => {
  const { t } = useTranslation();

  return (
    <button
      className={`location-button ${className} ${disabled ? 'location-button--disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={t('map.currentLocation')}
      title={t('map.currentLocation')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8"></circle>
        <line x1="12" y1="2" x2="12" y2="4"></line>
        <line x1="12" y1="20" x2="12" y2="22"></line>
        <line x1="2" y1="12" x2="4" y2="12"></line>
        <line x1="20" y1="12" x2="22" y2="12"></line>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    </button>
  );
};

export default LocationButton;