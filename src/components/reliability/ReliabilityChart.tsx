import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ReliabilityChartDataItem {
  range: string;
  label: string;
  count: number;
  color: string;
}

interface ReliabilityChartProps {
  data: ReliabilityChartDataItem[];
  title?: string;
  className?: string;
}

const ReliabilityChart: React.FC<ReliabilityChartProps> = ({
  data,
  title,
  className = '',
}) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className={`reliability-chart reliability-chart--empty ${className}`}>
        <p>{t('reliability.noDataAvailable')}</p>
      </div>
    );
  }

  // Sort data by range (90-100 first, then 80-89, etc.)
  const sortedData = [...data].sort((a, b) => {
    const aRangeParts = a.range.split('-').map(Number);
    const bRangeParts = b.range.split('-').map(Number);
    return bRangeParts[0] - aRangeParts[0];
  });

  // Calculate total stations for percentages
  const totalStations = sortedData.reduce((sum, item) => sum + item.count, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.count / totalStations) * 100).toFixed(1);
      
      return (
        <div className="reliability-chart__tooltip">
          <p className="reliability-chart__tooltip-label">{`${item.label} (${item.range})`}</p>
          <p className="reliability-chart__tooltip-value">
            {t('reliability.stationCount', { count: item.count })}
          </p>
          <p className="reliability-chart__tooltip-percentage">
            {t('reliability.percentageOfTotal', { percentage })}
          </p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={`reliability-chart ${className}`}>
      {title && <h3 className="reliability-chart__title">{title}</h3>}
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={sortedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="count" name={t('reliability.stationCount', { count: 0 })} >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="reliability-chart__summary">
        <div className="reliability-chart__total">
          <span className="reliability-chart__total-label">
            {t('reliability.totalStations')}:
          </span>
          <span className="reliability-chart__total-value">
            {totalStations}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReliabilityChart;