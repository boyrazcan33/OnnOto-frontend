import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import ReportTypeSelector from './ReportTypeSelector';
import { ReportType } from '../../types/report';
import useReports from '../../hooks/useReports';

interface ReportFormProps {
  stationId: string;
  stationName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

const ReportForm: React.FC<ReportFormProps> = ({
  stationId,
  stationName,
  onSuccess,
  onCancel,
  className = '',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { submitReport, submitting, submitError } = useReports(stationId);
  
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!reportType) {
      setError(t('reports.pleaseSelectType'));
      return;
    }
    
    // Reset error if any
    setError(null);
    
    // Submit report
    const result = await submitReport({
      stationId,
      reportType: reportType.toString(),
      description
    });
    
    if (result) {
      setSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1); // Go back if no cancel handler provided
    }
  };

  // Show success message after submission
  if (success) {
    return (
      <div className={`report-form report-form--success ${className}`}>
        <h2 className="report-form__title">{t('reports.thankYou')}</h2>
        <p className="report-form__message">{t('reports.reportReceived')}</p>
        <Button
          variant="primary"
          onClick={() => navigate(`/station/${stationId}`)}
        >
          {t('reports.backToStation')}
        </Button>
      </div>
    );
  }

  return (
    <div className={`report-form ${className}`}>
      <h2 className="report-form__title">
        {t('reports.reportIssue')}
      </h2>
      
      <p className="report-form__station">
        {t('reports.reportingFor')}: <strong>{stationName}</strong>
      </p>
      
      {error && (
        <div className="report-form__error">
          {error}
        </div>
      )}
      
      {submitError && (
        <div className="report-form__error">
          {t('reports.submissionError')}: {submitError.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="report-form__field">
          <label className="report-form__label">
            {t('reports.selectIssueType')}
          </label>
          <ReportTypeSelector
            selected={reportType}
            onChange={setReportType}
          />
        </div>
        
        <div className="report-form__field">
          <label className="report-form__label" htmlFor="report-description">
            {t('reports.descriptionOptional')}
          </label>
          <Input
            id="report-description"
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('reports.descriptionPlaceholder')}
            rows={4}
          />
        </div>
        
        <div className="report-form__actions">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={submitting}
          >
            {t('common.cancel')}
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            disabled={submitting}
          >
            {t('reports.submitReport')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;