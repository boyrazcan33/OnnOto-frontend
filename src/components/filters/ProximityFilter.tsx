import React from 'react';
import { useTranslation } from 'react-i18next';
import Slider from '../common/Slider';

interface ProximityFilterProps {
  value: number;
  onChange: (radius: number) => void;
}

const ProximityFilter: React.FC<ProximityFilterProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="filter-section">
      <h3 className="filter-section__title">{t('filters.proximity')}</h3>
      
      <div className="filter-section__slider">
        <Slider
          min={1}
          max={50}
          step={1}
          value={value}
          onChange={onChange}
        />
        
        <div className="filter-section__slider-value">
          {t('filters.radiusKm', { km: value })}
        </div>
      </div>
    </div>
  );
};

export default ProximityFilter;