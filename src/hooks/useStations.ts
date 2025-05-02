import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Station } from '../types/station';
import stationsApi from '../api/stationsApi';
import { STORAGE_KEYS } from '../constants/storageKeys';

interface UseStationsResult {
  stations: Station[];
  loading: boolean;
  error: Error | null;
  refreshStations: () => Promise<void>;
  favoriteStations: Station[];
  toggleFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
}

/**
 * Hook to fetch and manage stations
 */
const useStations = (): UseStationsResult => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);

  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.user.favorites);

  // Fetch stations from API or cache
  const fetchStations = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        try {
          const cachedData = localStorage.getItem(STORAGE_KEYS.CACHED_STATIONS);
          const cachedTimestamp = localStorage.getItem(STORAGE_KEYS.CACHED_TIMESTAMP);

          if (cachedData && cachedTimestamp) {
            const parsedData = JSON.parse(cachedData) as Station[];
            const timestamp = parseInt(cachedTimestamp, 10);
            const now = Date.now();

            // Use cache if less than 15 minutes old
            if (now - timestamp < 15 * 60 * 1000) {
              setStations(parsedData);
              setLastFetched(timestamp);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Error reading from cache:', err);
          // Continue with API fetch on cache error
        }
      }

      // Fetch from API
      const data = await stationsApi.getAllStations();
      setStations(data);
      setLastFetched(Date.now());

      // Update cache
      try {
        localStorage.setItem(STORAGE_KEYS.CACHED_STATIONS, JSON.stringify(data));
        localStorage.setItem(STORAGE_KEYS.CACHED_TIMESTAMP, Date.now().toString());
      } catch (err) {
        console.warn('Error writing to cache:', err);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching stations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch stations on mount
  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  // Get favorite stations
  const favoriteStations = stations.filter(station => 
    favorites.includes(station.id)
  );

  // Check if a station is a favorite
  const isFavorite = (stationId: string): boolean => {
    return favorites.includes(stationId);
  };

  // Toggle a station as favorite
  const toggleFavorite = (stationId: string): void => {
    dispatch({ type: 'user/toggleFavorite', payload: stationId });
  };

  return {
    stations,
    loading,
    error,
    refreshStations: () => fetchStations(true),
    favoriteStations,
    toggleFavorite,
    isFavorite
  };
};

export default useStations;