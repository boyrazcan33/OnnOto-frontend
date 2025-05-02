import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/onboarding/LanguageSelector';
import LocationPermission from '../components/onboarding/LocationPermission';
import OnboardingSlide from '../components/onboarding/OnboardingSlide';
import OnboardingControls from '../components/onboarding/OnboardingControls';

const OnboardingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/map');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate('/map');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingSlide
            title={t('onboarding.welcome.title')}
            description={t('onboarding.welcome.description')}
            icon="👋"
          >
            <LanguageSelector
              onSelect={() => {}}
              className="mt-8"
            />
          </OnboardingSlide>
        );

      case 2:
        return (
          <LocationPermission
            onAllow={handleNext}
            onSkip={handleNext}
          />
        );

      case 3:
        return (
          <OnboardingSlide
            title={t('onboarding.features.title')}
            description={t('onboarding.features.description')}
            icon="⚡"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>{t('onboarding.features.find.title')}</h3>
                <p>{t('onboarding.features.find.description')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>{t('onboarding.features.reliability.title')}</h3>
                <p>{t('onboarding.features.reliability.description')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>{t('onboarding.features.status.title')}</h3>
                <p>{t('onboarding.features.status.description')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3>{t('onboarding.features.offline.title')}</h3>
                <p>{t('onboarding.features.offline.description')}</p>
              </div>
            </div>
          </OnboardingSlide>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-content">
        {renderStep()}
        <OnboardingControls
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onBack={handleBack}
          onSkip={handleSkip}
          nextLabel={currentStep === totalSteps ? t('onboarding.finish') : undefined}
        />
      </div>
    </div>
  );
};

export default OnboardingPage;