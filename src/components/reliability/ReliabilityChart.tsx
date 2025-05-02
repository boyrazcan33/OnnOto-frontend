import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../common/Loader';

interface ReliabilityChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  title?: string;
  className?: string;
}

const ReliabilityChart: React.FC<ReliabilityChartProps> = ({
  data,
  title,
  className = '',
}) => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  // Check if we're running in the browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Avoid rendering during SSR
  }

  if (!data || data.length === 0) {
    return (
      <div className={`reliability-chart reliability-chart--empty ${className}`}>
        <p>{t('reliability.noDataAvailable')}</p>
      </div>
    );
  }

  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const maxValue = Math.max(...sortedData.map(item => item.value));

  return (
    <div className={`reliability-chart ${className}`}>
      {title && <h3 className="reliability-chart__title">{title}</h3>}
      
      <div className="reliability-chart__container">
        {sortedData.map((item, index) => (
          <div key={index} className="reliability-chart__item">
            <div className="reliability-chart__label">{item.label}</div>
            <div className="reliability-chart__bar-container">
              <div 
                className="reliability-chart__bar"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || '#2a9d8f'
                }}
              ></div>
              <div className="reliability-chart__value">{item.value.toFixed(1)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReliabilityChart;