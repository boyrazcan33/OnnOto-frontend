import { useState, useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './redux';
import { Station } from '../types/station';
import stationsApi from '../api/stationsApi';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { toggleFavorite } from '../store/userSlice';

// Sample fallback data for development mode
const FALLBACK_STATIONS: Station[] = [
  {
    id: "station-1",
    name: "Central Station",
    networkName: "ELMO",
    networkId: "elmo",
    operatorName: "ELMO Operator",
    operatorId: "elmo-op",
    latitude: 59.4370,
    longitude: 24.7536,
    address: "Viru väljak 4",
    city: "Tallinn",
    postalCode: "10111",
    country: "Estonia",
    reliabilityScore: 95,
    availableConnectors: 3,
    totalConnectors: 4,
    lastStatusUpdate: new Date().toISOString(),
    connectors: []
  },
  {
    id: "station-2",
    name: "Shopping Mall Charger",
    networkName: "Eleport",
    networkId: "eleport",
    operatorName: "Eleport",
    operatorId: "eleport-op",
    latitude: 59.4230,
    longitude: 24.7856,
    address: "Narva mnt 7",
    city: "Tallinn",
    postalCode: "10117",
    country: "Estonia",
    reliabilityScore: 87,
    availableConnectors: 1,
    totalConnectors: 2,
    lastStatusUpdate: new Date().toISOString(),
    connectors: []
  }
];

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

  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.user.favorites);

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
      try {
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
      } catch (apiError) {
        console.error('Error fetching stations:', apiError);
        setError(apiError as Error);
        
        // Use fallback data in development mode
        if (process.env.NODE_ENV === 'development') {
          console.warn('Using fallback station data for development');
          setStations(FALLBACK_STATIONS);
        }
      }
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
  const handleToggleFavorite = (stationId: string): void => {
    dispatch(toggleFavorite(stationId));
  };

  return {
    stations,
    loading,
    error,
    refreshStations: () => fetchStations(true),
    favoriteStations,
    toggleFavorite: handleToggleFavorite,
    isFavorite
  };
};

export default useStations;