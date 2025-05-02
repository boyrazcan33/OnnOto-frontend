import React from 'react';
import { useTranslation } from 'react-i18next';
import Slider from '../common/Slider';
import { formatReliabilityScore } from '../../utils/formatters';

interface ReliabilityFilterProps {
  value: number;
  onChange: (minimumReliability: number) => void;
}

const ReliabilityFilter: React.FC<ReliabilityFilterProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const reliabilityData = formatReliabilityScore(value);

  return (
    <div className="filter-section">
      <h3 className="filter-section__title">{t('filters.minimumReliability')}</h3>
      
      <div className="filter-section__slider">
        <Slider
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={onChange}
        />
        
        <div className="filter-section__slider-value" style={{ color: reliabilityData.color }}>
          {value > 0 ? (
            <>
              <span className="filter-section__slider-score">{reliabilityData.value}</span>
              <span className="filter-section__slider-stars">{reliabilityData.symbol}</span>
            </>
          ) : (
            t('filters.noMinimum')
          )}
        </div>
      </div>
    </div>
  );
};

export default ReliabilityFilter;