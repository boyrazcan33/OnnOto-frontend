import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';

interface ReportSubmitButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ReportSubmitButton: React.FC<ReportSubmitButtonProps> = ({
  onClick,
  variant = 'primary',
  size = 'medium',
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`report-submit-button ${className}`}
    >
      <span className="report-submit-button__icon">⚠️</span>
      <span className="report-submit-button__text">
        {t('reports.reportIssue')}
      </span>
    </Button>
  );
};

export default ReportSubmitButton;