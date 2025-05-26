import React from 'react';
import { useTranslation } from 'react-i18next';

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
        <input
          type="range"
          min={1}
          max={50}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #2a9d8f 0%, #2a9d8f ${(value-1)/49*100}%, #e9ecef ${(value-1)/49*100}%, #e9ecef 100%)`
          }}
        />
        
        <div className="filter-section__markers">
          <span className="filter-section__marker filter-section__marker--min">1</span>
          <span className="filter-section__marker filter-section__marker--max">50</span>
        </div>
        
        <div className="filter-section__slider-value">
          {t('filters.radiusKm', { km: value })}
        </div>
      </div>
    </div>
  );
};

export default ProximityFilter;