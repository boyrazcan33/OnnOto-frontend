import React from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';

const OfflinePage: React.FC = () => {
  const { t } = useTranslation();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <MainLayout showHeader={false} showFooter={false}>
      <div className="offline-page">
        <div className="offline-page__content">
          <div className="offline-page__icon">📡</div>
          
          <h1 className="offline-page__title">
            {t('offline.title')}
          </h1>
          
          <p className="offline-page__message">
            {t('offline.message')}
          </p>
          
          <div className="offline-page__features">
            <h2 className="offline-page__subtitle">
              {t('offline.availableFeatures')}:
            </h2>
            <ul className="offline-page__feature-list">
              <li>{t('offline.feature1')}</li>
              <li>{t('offline.feature2')}</li>
              <li>{t('offline.feature3')}</li>
            </ul>
          </div>
          
          <Button 
            variant="primary"
            onClick={handleRetry}
            className="offline-page__retry-button"
          >
            {t('offline.retry')}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default OfflinePage;