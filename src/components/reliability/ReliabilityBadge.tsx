import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatReliabilityScore } from '../../utils/formatters';

interface ReliabilityBadgeProps {
  score: number;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ReliabilityBadge: React.FC<ReliabilityBadgeProps> = ({
  score,
  showText = true,
  size = 'medium',
  className = '',
}) => {
  const { t } = useTranslation();
  const reliabilityData = formatReliabilityScore(score);

  return (
    <div
      className={`reliability-badge reliability-badge--${size} ${className}`}
      title={t('reliability.score')}
    >
      <div 
        className="reliability-badge__circle"
        style={{ backgroundColor: reliabilityData.color }}
      >
        {reliabilityData.value}
      </div>
      
      {showText && (
        <div className="reliability-badge__text">
          {t('reliability.reliability')}
        </div>
      )}
    </div>
  );
};

export default ReliabilityBadge;