// src/pages/LandingPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';
import useStations from '../hooks/useStations';
import StationCard from '../components/stations/StationCard';
import { formatReliabilityScore } from '../utils/formatters';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stations, loading } = useStations();

  // Get most reliable stations (top 3)
  const topStations = React.useMemo(() => {
    return [...stations]
      .filter(station => station.reliabilityScore > 0)
      .sort((a, b) => b.reliabilityScore - a.reliabilityScore)
      .slice(0, 3);
  }, [stations]);

  const goToMap = () => {
    navigate('/map');
  };

  const handleStationClick = (stationId: string) => {
    navigate(`/station/${stationId}`);
  };

  return (
    <MainLayout>
      <div className="landing-page">
        <section className="landing-page__hero">
          <div className="landing-page__hero-content">
            <h1 className="landing-page__title">{t('landing.title')}</h1>
            <p className="landing-page__subtitle">{t('landing.subtitle')}</p>
            
            <div className="landing-page__cta">
              <Button 
                variant="primary" 
                size="large" 
                onClick={goToMap}
              >
                {t('landing.exploreMap')}
              </Button>
            </div>
          </div>
          <div className="landing-page__hero-image">
            <img 
              src="/images/evcharger-pic.webp" 
              alt="Electric Vehicle Charger" 
              className="landing-page__hero-img"
            />
          </div>
        </section>

        <section className="landing-page__features">
          <h2 className="landing-page__section-title">{t('landing.featuresTitle')}</h2>
          
          <div className="landing-page__feature-grid">
            <div className="landing-page__feature">
              <div className="landing-page__feature-icon">🔍</div>
              <h3 className="landing-page__feature-title">{t('landing.feature1Title')}</h3>
              <p className="landing-page__feature-text">{t('landing.feature1Text')}</p>
            </div>
            
            <div className="landing-page__feature">
              <div className="landing-page__feature-icon">📊</div>
              <h3 className="landing-page__feature-title">{t('landing.feature2Title')}</h3>
              <p className="landing-page__feature-text">{t('landing.feature2Text')}</p>
            </div>
            
            <div className="landing-page__feature">
              <div className="landing-page__feature-icon">📱</div>
              <h3 className="landing-page__feature-title">{t('landing.feature3Title')}</h3>
              <p className="landing-page__feature-text">{t('landing.feature3Text')}</p>
            </div>
          </div>
        </section>

        <section className="landing-page__top-stations">
          <h2 className="landing-page__section-title">{t('landing.topStationsTitle')}</h2>
          
          {loading ? (
            <p>{t('stations.loading')}</p>
          ) : topStations.length > 0 ? (
            <div className="landing-page__station-grid">
              {topStations.map(station => (
                <StationCard
                  key={station.id}
                  station={station}
                  onClick={() => handleStationClick(station.id)}
                />
              ))}
            </div>
          ) : (
            <p>{t('stations.noStationsFound')}</p>
          )}
          
          <div className="landing-page__view-all">
            <Button 
              variant="outline" 
              onClick={goToMap}
            >
              {t('landing.viewAllStations')}
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default LandingPage;