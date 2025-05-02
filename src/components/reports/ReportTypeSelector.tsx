import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReportType } from '../../types/report';

interface ReportTypeSelectorProps {
  selected: ReportType | null;
  onChange: (type: ReportType) => void;
  className?: string;
}

interface ReportTypeOption {
  type: ReportType;
  label: string;
  description: string;
  icon: string;
}

const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({
  selected,
  onChange,
  className = '',
}) => {
  const { t } = useTranslation();

  // Define report type options
  const options: ReportTypeOption[] = [
    {
      type: ReportType.OFFLINE,
      label: t('reports.types.offline'),
      description: t('reports.descriptions.offline'),
      icon: '🔌'
    },
    {
      type: ReportType.DAMAGED,
      label: t('reports.types.damaged'),
      description: t('reports.descriptions.damaged'),
      icon: '🔨'
    },
    {
      type: ReportType.INCORRECT_INFO,
      label: t('reports.types.incorrectInfo'),
      description: t('reports.descriptions.incorrectInfo'),
      icon: 'ℹ️'
    },
    {
      type: ReportType.OCCUPIED,
      label: t('reports.types.occupied'),
      description: t('reports.descriptions.occupied'),
      icon: '🚗'
    }
  ];

  return (
    <div className={`report-type-selector ${className}`}>
      {options.map(option => (
        <div
          key={option.type}
          className={`report-type-option ${selected === option.type ? 'report-type-option--selected' : ''}`}
          onClick={() => onChange(option.type)}
        >
          <div className="report-type-option__icon">
            {option.icon}
          </div>
          
          <div className="report-type-option__content">
            <div className="report-type-option__label">
              {option.label}
            </div>
            
            <div className="report-type-option__description">
              {option.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportTypeSelector;