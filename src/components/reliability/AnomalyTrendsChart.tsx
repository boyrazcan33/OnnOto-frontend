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

  // Electric color scheme for different anomaly types
  const colorMap: Record<string, string> = {
    STATUS_FLAPPING: '#00d4ff',    // Electric blue
    EXTENDED_DOWNTIME: '#ff3366',  // Vibrant red
    CONNECTOR_MISMATCH: '#00ff88', // Electric green
    PATTERN_DEVIATION: '#ffb000',  // Golden amber
    REPORT_SPIKE: '#8b5cf6'        // Electric purple
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
          {data.series.map((series, index) => (
            <Line
              key={series.name}
              type="monotone"
              dataKey={series.name}
              name={series.name}
              stroke={colorMap[series.name] || '#64748b'}
              strokeWidth={3}
              dot={{ strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8, stroke: colorMap[series.name] || '#64748b', strokeWidth: 2 }}
              animationBegin={200 + index * 100}
              animationDuration={1200}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnomalyTrendsChart;