import { useState, useEffect, useCallback } from 'react';
import { getCurrentLocation, getLastLocation, DEFAULT_LOCATION } from '../utils/locationUtils';

export interface LocationState {
  latitude: number;
  longitude: number;
  accuracy?: number;
  loading: boolean;
  error: Error | null;
  timestamp?: number;
}

/**
 * Hook to get and track user location
 */
const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
    loading: true,
    error: null
  });

  const refreshLocation = useCallback(async () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    try {
      const coords = await getCurrentLocation();
      setLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        loading: false,
        error: null,
        timestamp: Date.now()
      });
    } catch (error) {
      // Try to use last known location on error
      const lastLocation = getLastLocation();
      
      if (lastLocation) {
        setLocation({
          ...lastLocation,
          loading: false,
          error: error as Error,
          timestamp: Date.now()
        });
      } else {
        setLocation({
          latitude: DEFAULT_LOCATION.latitude,
          longitude: DEFAULT_LOCATION.longitude,
          loading: false,
          error: error as Error
        });
      }
    }
  }, []);

  // Get location on mount
  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  return {
    ...location,
    refreshLocation
  };
};

export default useLocation;