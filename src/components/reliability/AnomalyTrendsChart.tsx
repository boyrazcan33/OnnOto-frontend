import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AnomalyTrendData {
  date: string;
  [key: string]: number | string;
}

interface AnomalyTrendsChartProps {
  data: {
    dates: string[];
    series: Array<{
      name: string;
      data: number[];
    }>;
  };
  className?: string;
}

const AnomalyTrendsChart: React.FC<AnomalyTrendsChartProps> = ({ data, className = '' }) => {
  const { t } = useTranslation();

  if (!data || !data.dates || !data.series || data.series.length === 0) {
    return (
      <div className={`anomaly-trends-chart anomaly-trends-chart--empty ${className}`}>
        <p>{t('reliability.noAnomalyData')}</p>
      </div>
    );
  }

  // Transform the data into the format expected by recharts
  const chartData: AnomalyTrendData[] = data.dates.map((date, index) => {
    const item: AnomalyTrendData = { date };
    data.series.forEach(series => {
      item[series.name] = series.data[index];
    });
    return item;
  });

  // Colors for different anomaly types
  const colorMap: Record<string, string> = {
    STATUS_FLAPPING: '#8884d8',
    EXTENDED_DOWNTIME: '#e74c3c',
    CONNECTOR_MISMATCH: '#2ecc71',
    PATTERN_DEVIATION: '#f39c12',
    REPORT_SPIKE: '#3498db'
  };

  return (
    <div className={`anomaly-trends-chart ${className}`}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => {
              // Translate the anomaly type name
              const translatedName = t(`anomalies.types.${name.toLowerCase()}`);
              return [value, translatedName];
            }}
          />
          <Legend 
            formatter={(value: string) => {
              // Translate the anomaly type name
              return t(`anomalies.types.${value.toLowerCase()}`);
            }}
          />
          {data.series.map((series) => (
            <Line
              key={series.name}
              type="monotone"
              dataKey={series.name}
              name={series.name}
              stroke={colorMap[series.name] || '#000000'}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnomalyTrendsChart;