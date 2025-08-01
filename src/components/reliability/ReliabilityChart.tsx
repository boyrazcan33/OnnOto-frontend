import React, { useEffect, useState } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  stationId?: string;
  chartType?: 'line' | 'bar';
  data?: Array<{
    range?: string;
    label?: string;
    count?: number;
    color?: string;
    date?: string;
    score?: number;
    uptime?: number;
  }>;
  height?: number;
  className?: string;
}

interface HistoryDataPoint {
  timestamp: string;
  score: number;
  uptime: number;
}

const ReliabilityChart: React.FC<ReliabilityChartProps> = ({
                                                             stationId,
                                                             chartType = 'line',
                                                             data: externalData,
                                                             height = 300,
                                                             className = ''
                                                           }) => {
  const [chartData, setChartData] = useState<any[]>([]);

  const queryResult: UseQueryResult<ReliabilityMetric> = useQuery({
    queryKey: ['reliability', stationId],
    queryFn: async () => {
      if (!stationId) throw new Error('Station ID is required');
      return reliabilityApi.getStationReliability(stationId);
    },
    enabled: !!stationId
  });

  const { data: queryData, isLoading, error } = queryResult;

  useEffect(() => {
    if (externalData) {
      setChartData(externalData);
    } else if (queryData?.historyData) {
      const transformedData = queryData.historyData.map((item: HistoryDataPoint) => ({
        date: new Date(item.timestamp).toLocaleDateString(),
        score: item.score,
        uptime: item.uptime * 100
      }));
      setChartData(transformedData);
    }
  }, [queryData, externalData]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if ((error || !queryData) && !externalData) {
    return <div className="chart-error">Error loading chart data</div>;
  }

  if (!chartData.length) {
    return <div className="chart-error">No data available</div>;
  }

  return (
    <div className={`reliability-chart ${className}`}>
      {chartType === 'line' && stationId && queryData && (
        <div className="reliability-chart__header">
          <h3 className="reliability-chart__title">Reliability History</h3>
          <div className="reliability-chart__legend">
            <span className="reliability-chart__score">
              Current Score: {queryData.currentScore.toFixed(1)}
            </span>
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        {chartType === 'line' ? (
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
              stroke="#00d4ff"
              strokeWidth={3}
              dot={{ fill: '#00d4ff', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#00d4ff', strokeWidth: 2 }}
              animationBegin={200}
              animationDuration={1200}
            />
            <Line
              type="monotone"
              dataKey="uptime"
              name="Uptime %"
              stroke="#00ff88"
              strokeWidth={3}
              dot={{ fill: '#00ff88', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#00ff88', strokeWidth: 2 }}
              animationBegin={400}
              animationDuration={1200}
            />
          </LineChart>
        ) : (
          <BarChart
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
              dataKey="label"
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="count"
              name="Stations"
              fill="#00d4ff"
              radius={[4, 4, 0, 0]}
              animationBegin={200}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey="count"
                  fill={entry.color || '#00d4ff'}
                />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>

      {chartType === 'line' && stationId && queryData && (
        <div className="reliability-chart__stats">
          <div className="reliability-chart__stat">
            <label>Average Score:</label>
            <span>{queryData.averageScore.toFixed(1)}</span>
          </div>
          <div className="reliability-chart__stat">
            <label>Uptime:</label>
            <span>{(queryData.uptime * 100).toFixed(1)}%</span>
          </div>
          <div className="reliability-chart__stat">
            <label>Report Count:</label>
            <span>{queryData.reportCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReliabilityChart;