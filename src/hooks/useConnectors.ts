import { useState, useEffect } from 'react';
import { Connector } from '../types/connector';
import connectorsApi from '../api/connectorsApi';

interface UseConnectorsResult {
  connectors: Connector[];
  loading: boolean;
  error: Error | null;
  refreshConnectors: () => Promise<void>;
}

/**
 * Hook to fetch and manage connectors for a station
 */
const useConnectors = (stationId: string): UseConnectorsResult => {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConnectors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await connectorsApi.getConnectorsByStationId(stationId);
      setConnectors(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching connectors:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch connectors on mount or when stationId changes
  useEffect(() => {
    fetchConnectors();
  }, [stationId]);

  return {
    connectors,
    loading,
    error,
    refreshConnectors: fetchConnectors
  };
};

export default useConnectors;