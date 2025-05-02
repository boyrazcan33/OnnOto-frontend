import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';

interface ReportConfirmationProps {
  stationName: string;
  onBackToStation: () => void;
  onSubmitAnotherReport?: () => void;
  className?: string;
}

const ReportConfirmation: React.FC<ReportConfirmationProps> = ({
  stationName,
  onBackToStation,
  onSubmitAnotherReport,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`report-confirmation ${className}`}>
      <div className="report-confirmation__icon">
        ✅
      </div>
      
      <h2 className="report-confirmation__title">
        {t('reports.thankYou')}
      </h2>
      
      <p className="report-confirmation__message">
        {t('reports.confirmationMessage', { stationName })}
      </p>
      
      <div className="report-confirmation__actions">
        <Button
          variant="primary"
          onClick={onBackToStation}
        >
          {t('reports.backToStation')}
        </Button>
        
        {onSubmitAnotherReport && (
          <Button
            variant="outline"
            onClick={onSubmitAnotherReport}
          >
            {t('reports.submitAnotherReport')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportConfirmation;