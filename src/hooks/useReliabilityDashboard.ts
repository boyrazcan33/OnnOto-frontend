import { useState, useEffect } from 'react';
import { Station } from '../types/station';
import { AnomalyType, ReliabilityMetric } from '../types/reliability';
import reliabilityApi from '../api/reliabilityApi';
import anomaliesApi from '../api/anomaliesApi';
import visualizationsApi from '../api/visualizationsApi';
import stationsApi from '../api/stationsApi';

interface UseReliabilityDashboardParams {
  days?: number;
  cityFilter?: string;
  networkFilter?: string;
  showProblematicOnly?: boolean;
}

interface UseReliabilityDashboardResult {
  loading: boolean;
  error: Error | null;
  distributionData: any;
  networkComparisonData: any[];
  anomalyTrendsData: any;
  reliableStations: Station[];
  problematicStations: Station[];
  recentAnomalies: AnomalyType[];
  refreshData: () => void;
}

/**
 * Hook for fetching and managing reliability dashboard data
 */
const useReliabilityDashboard = ({
  days = 30,
  cityFilter = '',
  networkFilter = '',
  showProblematicOnly = false
}: UseReliabilityDashboardParams = {}): UseReliabilityDashboardResult => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [distributionData, setDistributionData] = useState<any>(null);
  const [networkComparisonData, setNetworkComparisonData] = useState<any[]>([]);
  const [anomalyTrendsData, setAnomalyTrendsData] = useState<any>(null);
  const [reliableStations, setReliableStations] = useState<Station[]>([]);
  const [problematicStations, setProblematicStations] = useState<Station[]>([]);
  const [recentAnomalies, setRecentAnomalies] = useState<AnomalyType[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch reliability distribution
      const distributionData = await visualizationsApi.getReliabilityDistribution();
      setDistributionData(distributionData);

      // Fetch network comparison
      const networkData = await visualizationsApi.getReliabilityByNetwork();
      setNetworkComparisonData(networkData);

      // Fetch anomaly trends
      const anomalyTrends = await visualizationsApi.getAnomalyTrends(days);
      setAnomalyTrendsData(anomalyTrends);

      // Fetch most reliable stations
      const reliableMetrics = await reliabilityApi.getMostReliableStations(5);
      
      // Fetch station details for reliable stations
      const reliableStationPromises = reliableMetrics.map((metric: ReliabilityMetric) => 
        stationsApi.getStationById(metric.stationId)
      );
      const reliableStationDetails = await Promise.all(reliableStationPromises);
      setReliableStations(reliableStationDetails);

      // Fetch problematic stations
      const problematicStationsData = await anomaliesApi.getStationsWithMostAnomalies(5);
      
      // Fetch station details for problematic stations
      const problematicStationPromises = problematicStationsData.map((item: any) => 
        stationsApi.getStationById(item.stationId)
      );
      const problematicStationDetails = await Promise.all(problematicStationPromises);
      setProblematicStations(problematicStationDetails);

      // Fetch recent anomalies
      const recentAnomaliesData = await anomaliesApi.getRecentAnomalies(24 * days);
      setRecentAnomalies(recentAnomaliesData);
    } catch (err) {
      console.error('Error fetching reliability dashboard data:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when parameters change
  useEffect(() => {
    fetchDashboardData();
  }, [days, cityFilter, networkFilter, showProblematicOnly]);

  return {
    loading,
    error,
    distributionData,
    networkComparisonData,
    anomalyTrendsData,
    reliableStations,
    problematicStations,
    recentAnomalies,
    refreshData: fetchDashboardData
  };
};

export default useReliabilityDashboard;