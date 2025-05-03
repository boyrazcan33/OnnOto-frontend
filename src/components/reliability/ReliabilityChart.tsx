// src/components/reliability/ReliabilityChart.tsx
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import LoadingSpinner from '../common/LoadingSpinner';
import { ReliabilityMetric } from '../../types/reliability';
import reliabilityApi from '../../api/reliabilityApi';

interface ReliabilityChartProps {
  stationId: string;
  days?: number;
  height?: number;
  className?: string;
}

interface ChartData {
  date: string;
  score: number;
  uptime: number;
}

const ReliabilityChart: React.FC<ReliabilityChartProps> = ({
  stationId,
  days = 30,
  height = 300,
  className = ''
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const { data, isLoading, error } = useQuery<ReliabilityMetric>(
    ['reliability', stationId],
    () => reliabilityApi.getStationReliability(stationId),
    {
      staleTime: 300000, // 5 minutes
      refetchInterval: 300000,
      onSuccess: (data) => {
        const transformedData = data.historyData.map(item => ({
          date: new Date(item.timestamp).toLocaleDateString(),
          score: item.score,
          uptime: item.uptime * 100
        }));
        setChartData(transformedData);
      }
    }
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="chart-error">Error loading reliability data</div>;
  }

  if (!data || chartData.length === 0) {
    return <div className="chart-empty">No reliability data available</div>;
  }

  return (
    <div className={`reliability-chart ${className}`}>
      <div className="reliability-chart__header">
        <h3 className="reliability-chart__title">Reliability History</h3>
        <div className="reliability-chart__legend">
          <span className="reliability-chart__score">
            Current Score: {data.currentScore.toFixed(1)}
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis
            domain={[0, 100]}
            label={{
              value: 'Reliability Score',
              angle: -90,
              position: 'insideLeft'
            }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            name="Reliability Score"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="uptime"
            name="Uptime %"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="reliability-chart__stats">
        <div className="reliability-chart__stat">
          <label>Average Score:</label>
          <span>{data.averageScore.toFixed(1)}</span>
        </div>
        <div className="reliability-chart__stat">
          <label>Uptime:</label>
          <span>{(data.uptime * 100).toFixed(1)}%</span>
        </div>
        <div className="reliability-chart__stat">
          <label>Report Count:</label>
          <span>{data.reportCount}</span>
        </div>
      </div>
    </div>
  );
};

export default ReliabilityChart;