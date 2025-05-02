import React, { createContext, useEffect, useState } from 'react';
import { getCurrentLocation, getLastLocation, DEFAULT_LOCATION } from '../utils/locationUtils';

interface LocationState {
  latitude: number;
  longitude: number;
  accuracy?: number;
  loading: boolean;
  error: Error | null;
  timestamp?: number;
}

interface LocationContextType extends LocationState {
  refreshLocation: () => Promise<void>;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

export const LocationContext = createContext<LocationContextType>({
  latitude: DEFAULT_LOCATION.latitude,
  longitude: DEFAULT_LOCATION.longitude,
  loading: true,
  error: null,
  hasPermission: false,
  refreshLocation: async () => {},
  requestPermission: async () => false
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationState>({
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
    loading: true,
    error: null
  });
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = async (): Promise<boolean> => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setHasPermission(result.state === 'granted');
      return result.state === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const refreshLocation = async () => {
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
  };

  // Initial location fetch
  useEffect(() => {
    requestPermission().then(granted => {
      if (granted) {
        refreshLocation();
      }
    });
  }, []);

  // Watch for permission changes
  useEffect(() => {
    const handlePermissionChange = async () => {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      setHasPermission(result.state === 'granted');
      
      result.addEventListener('change', () => {
        setHasPermission(result.state === 'granted');
      });
    };

    handlePermissionChange();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        ...location,
        hasPermission,
        refreshLocation,
        requestPermission
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};