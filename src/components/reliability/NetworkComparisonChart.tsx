import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell // Added missing Cell import
} from 'recharts';
import Loader from '../common/Loader';
import visualizationsApi from '../../api/visualizationsApi';

interface NetworkComparisonChartProps {
  className?: string;
}

// Define the type for network data
interface NetworkData {
  name: string;
  networkName: string;
  averageReliability: number;
  stationCount: number;
  color: string;
}

const NetworkComparisonChart: React.FC<NetworkComparisonChartProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [networkData, setNetworkData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await visualizationsApi.getReliabilityByNetwork();
        setNetworkData(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching network comparison data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`network-comparison ${className}`}>
        <Loader size="small" text={t('reliability.loadingNetworkData')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`network-comparison network-comparison--error ${className}`}>
        <p>{t('reliability.errorLoadingNetworkData')}</p>
      </div>
    );
  }

  if (!networkData || networkData.length === 0) {
    return (
      <div className={`network-comparison network-comparison--empty ${className}`}>
        <p>{t('reliability.noNetworkData')}</p>
      </div>
    );
  }

  // Transform API data to chart-friendly format
  const chartData = networkData.map(network => ({
    name: network.networkName,
    score: network.averageReliability,
    count: network.stationCount,
    color: getColorForScore(network.averageReliability)
  }));

  // Sort by reliability score in descending order
  chartData.sort((a, b) => b.score - a.score);

  return (
    <div className={`network-comparison ${className}`}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}`, t('reliability.score')]}
            labelFormatter={(name: string) => name}
          />
          <Legend />
          <Bar 
            dataKey="score" 
            name={t('reliability.reliabilityScore')}
            barSize={30}
            radius={[0, 4, 4, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="network-comparison__legend">
        {chartData.map((network, index) => (
          <div key={index} className="network-comparison__legend-item">
            <span className="network-comparison__network-name">{network.name}</span>
            <span className="network-comparison__station-count">
              {t('reliability.stationCount', { count: network.count })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get color based on reliability score
const getColorForScore = (score: number): string => {
  if (score >= 90) return '#27ae60'; // Excellent
  if (score >= 80) return '#2ecc71'; // Very good
  if (score >= 70) return '#f39c12'; // Good
  if (score >= 50) return '#e67e22'; // Fair
  return '#e74c3c';                  // Poor
};

export default NetworkComparisonChart;