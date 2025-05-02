import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { offlineService } from '../../services/offlineService';

interface OfflineNotificationProps {
  className?: string;
}

const OfflineNotification: React.FC<OfflineNotificationProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const handleStatusChange = (online: boolean) => {
      setIsOffline(!online);
      if (!online || !isInitialLoad) {
        setShowNotification(true);
      }
      setIsInitialLoad(false);
    };

    offlineService.addStatusListener(handleStatusChange);

    return () => {
      offlineService.removeStatusListener(handleStatusChange);
    };
  }, [isInitialLoad]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  if (!showNotification) {
    return null;
  }

  return (
    <div 
      className={`offline-notification ${isOffline ? 'offline-notification--offline' : 'offline-notification--online'} ${className}`}
      role="alert"
    >
      <div className="offline-notification__icon">
        {isOffline ? '📡' : '✅'}
      </div>
      <div className="offline-notification__content">
        <p className="offline-notification__message">
          {isOffline 
            ? t('offline.statusOffline')
            : t('offline.statusOnline')
          }
        </p>
        {isOffline && (
          <p className="offline-notification__description">
            {t('offline.description')}
          </p>
        )}
      </div>
      <button 
        className="offline-notification__close"
        onClick={() => setShowNotification(false)}
        aria-label={t('common.close')}
      >
        ×
      </button>
    </div>
  );
};

export default OfflineNotification;