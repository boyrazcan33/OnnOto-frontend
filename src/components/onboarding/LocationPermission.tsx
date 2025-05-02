import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';

interface LocationPermissionProps {
  onAllow: () => void;
  onSkip: () => void;
  className?: string;
}

const LocationPermission: React.FC<LocationPermissionProps> = ({
  onAllow,
  onSkip,
  className = ''
}) => {
  const { t } = useTranslation();

  const handleAllowClick = async () => {
    try {
      await navigator.geolocation.getCurrentPosition(() => {
        onAllow();
      }, (error) => {
        console.error('Location permission denied:', error);
        onSkip();
      });
    } catch (error) {
      console.error('Error requesting location:', error);
      onSkip();
    }
  };

  return (
    <Card className={`location-permission ${className}`}>
      <div className="location-permission__icon">
        📍
      </div>
      
      <h2 className="location-permission__title">
        {t('onboarding.locationPermissionTitle')}
      </h2>
      
      <p className="location-permission__description">
        {t('onboarding.locationPermissionDescription')}
      </p>
      
      <div className="location-permission__benefits">
        <div className="location-permission__benefit">
          <span className="location-permission__benefit-icon">🔍</span>
          <span className="location-permission__benefit-text">
            {t('onboarding.locationBenefit1')}
          </span>
        </div>
        
        <div className="location-permission__benefit">
          <span className="location-permission__benefit-icon">⚡</span>
          <span className="location-permission__benefit-text">
            {t('onboarding.locationBenefit2')}
          </span>
        </div>
      </div>
      
      <div className="location-permission__actions">
        <Button
          variant="primary"
          onClick={handleAllowClick}
          fullWidth
        >
          {t('onboarding.allowLocation')}
        </Button>
        
        <Button
          variant="text"
          onClick={onSkip}
          fullWidth
        >
          {t('onboarding.skipForNow')}
        </Button>
      </div>
    </Card>
  );
};

export default LocationPermission;