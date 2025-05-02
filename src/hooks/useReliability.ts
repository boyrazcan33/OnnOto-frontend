import { useState, useEffect } from 'react';
import { ReliabilityMetric } from '../types/reliability';
import reliabilityApi from '../api/reliabilityApi';

interface UseReliabilityResult {
  reliability: ReliabilityMetric | null;
  loading: boolean;
  error: Error | null;
  refreshReliability: () => Promise<void>;
}

/**
 * Hook to fetch and manage reliability metrics for a station
 */
const useReliability = (stationId: string): UseReliabilityResult => {
  const [reliability, setReliability] = useState<ReliabilityMetric | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReliability = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await reliabilityApi.getStationReliability(stationId);
      setReliability(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching reliability metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reliability on mount or when stationId changes
  useEffect(() => {
    fetchReliability();
  }, [stationId]);

  return {
    reliability,
    loading,
    error,
    refreshReliability: fetchReliability
  };
};

export default useReliability;