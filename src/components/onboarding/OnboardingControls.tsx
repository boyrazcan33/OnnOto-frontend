import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';

interface OnboardingControlsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  className?: string;
}

const OnboardingControls: React.FC<OnboardingControlsProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  nextDisabled = false,
  nextLabel,
  className = ''
}) => {
  const { t } = useTranslation();
  const isLastStep = currentStep === totalSteps;

  return (
    <div className={`onboarding-controls ${className}`}>
      <div className="onboarding-controls__progress">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`onboarding-controls__progress-dot ${
              index === currentStep - 1 ? 'onboarding-controls__progress-dot--active' : ''
            }`}
          />
        ))}
      </div>
      
      <div className="onboarding-controls__buttons">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={onBack}
          >
            {t('common.back')}
          </Button>
        )}
        
        <div className="onboarding-controls__right">
          {onSkip && !isLastStep && (
            <Button
              variant="text"
              onClick={onSkip}
            >
              {t('common.skip')}
            </Button>
          )}
          
          <Button
            variant="primary"
            onClick={onNext}
            disabled={nextDisabled}
          >
            {nextLabel || (isLastStep ? t('common.finish') : t('common.next'))}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingControls;