import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatReliabilityScore } from '../../utils/formatters';

interface StationReliabilityScoreProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showStars?: boolean;
  className?: string;
}

const StationReliabilityScore: React.FC<StationReliabilityScoreProps> = ({
  score,
  size = 'medium',
  showStars = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const reliabilityData = formatReliabilityScore(score);

  return (
    <div
      className={`reliability-score reliability-score--${size} ${className}`}
      style={{ color: reliabilityData.color }}
      title={t('reliability.score')}
    >
      <span className="reliability-score__value">{reliabilityData.value}</span>
      {showStars && (
        <span className="reliability-score__stars">{reliabilityData.symbol}</span>
      )}
    </div>
  );
};

export default StationReliabilityScore;