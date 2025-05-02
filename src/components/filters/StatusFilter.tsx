import React from 'react';
import { useTranslation } from 'react-i18next';
import Switch from '../common/Switch';

interface StatusFilterProps {
  showOnlyAvailable: boolean;
  onChange: (showOnlyAvailable: boolean) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ showOnlyAvailable, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="filter-section">
      <h3 className="filter-section__title">{t('filters.status')}</h3>
      
      <div className="filter-section__switch">
        <Switch
          checked={showOnlyAvailable}
          onChange={onChange}
          label={t('filters.showOnlyAvailable')}
        />
      </div>
    </div>
  );
};

export default StatusFilter;