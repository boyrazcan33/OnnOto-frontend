import React from 'react';
import Card from '../common/Card';

interface OnboardingSlideProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  icon,
  children,
  className = ''
}) => {
  return (
    <Card className={`onboarding-slide ${className}`}>
      {icon && (
        <div className="onboarding-slide__icon">
          {icon}
        </div>
      )}
      
      <h2 className="onboarding-slide__title">
        {title}
      </h2>
      
      {description && (
        <p className="onboarding-slide__description">
          {description}
        </p>
      )}
      
      {children && (
        <div className="onboarding-slide__content">
          {children}
        </div>
      )}
    </Card>
  );
};

export default OnboardingSlide;