import React, { createContext, useEffect, useState } from 'react';
import preferencesApi from '../api/preferencesApi';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { getDeviceId } from '../utils/storageUtils';

interface Preferences {
  language: string;
  theme: 'light' | 'dark';
  useImperialUnits: boolean;
  defaultRadius: number;
  showOnlyAvailable: boolean;
  mapStyle: string;
  notificationsEnabled: boolean;
  defaultConnectorTypes: string[];
  [key: string]: any; // Add index signature to allow any string key
}

interface PreferencesContextType {
  preferences: Preferences;
  loading: boolean;
  error: Error | null;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => Promise<boolean>;
  resetPreferences: () => void;
  refreshPreferences: () => Promise<void>;
}

const DEFAULT_PREFERENCES: Preferences = {
  language: 'et',
  theme: 'light',
  useImperialUnits: false,
  defaultRadius: 5000, // meters
  showOnlyAvailable: false,
  mapStyle: 'default',
  notificationsEnabled: true,
  defaultConnectorTypes: []
};

export const PreferencesContext = createContext<PreferencesContextType>({
  preferences: DEFAULT_PREFERENCES,
  loading: true,
  error: null,
  setPreference: async () => false,
  resetPreferences: () => {},
  refreshPreferences: async () => {}
});

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadPreferences = async () => {
    const deviceId = getDeviceId();
    if (!deviceId) return;

    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API
      const data = await preferencesApi.getUserPreferences(deviceId);
      
      // Convert API response to preferences format
      const loadedPreferences: Preferences = {
        ...DEFAULT_PREFERENCES,
        ...Object.entries(data).reduce((acc, [key, value]) => {
          try {
            // Parse JSON values if possible
            acc[key as keyof Preferences] = JSON.parse(value);
          } catch {
            // Use string value if not JSON
            acc[key as keyof Preferences] = value;
          }
          return acc;
        }, {} as Preferences)
      };

      setPreferences(loadedPreferences);
      
      // Cache preferences locally
      localStorage.setItem(
        `${STORAGE_KEYS.PREFERENCES_PREFIX}${deviceId}`,
        JSON.stringify(loadedPreferences)
      );
    } catch (err) {
      setError(err as Error);
      
      // Try to load from cache on API error
      const cachedPrefs = localStorage.getItem(
        `${STORAGE_KEYS.PREFERENCES_PREFIX}${deviceId}`
      );
      
      if (cachedPrefs) {
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(cachedPrefs) });
      }
    } finally {
      setLoading(false);
    }
  };

  const setPreference = async <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ): Promise<boolean> => {
    const deviceId = getDeviceId();
    if (!deviceId) return false;

    try {
      // Save to API
      await preferencesApi.savePreference({
        deviceId,
        preferenceKey: key.toString(),
        preferenceValue: JSON.stringify(value)
      });

      // Update local state
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));

      // Update cache
      const cachedPrefs = localStorage.getItem(
        `${STORAGE_KEYS.PREFERENCES_PREFIX}${deviceId}`
      );
      const updatedPrefs = {
        ...(cachedPrefs ? JSON.parse(cachedPrefs) : {}),
        [key]: value
      };
      localStorage.setItem(
        `${STORAGE_KEYS.PREFERENCES_PREFIX}${deviceId}`,
        JSON.stringify(updatedPrefs)
      );

      return true;
    } catch (err) {
      console.error('Error saving preference:', err);
      return false;
    }
  };

  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    const deviceId = getDeviceId();
    if (deviceId) {
      localStorage.removeItem(`${STORAGE_KEYS.PREFERENCES_PREFIX}${deviceId}`);
    }
  };

  // Load preferences on mount and when deviceId changes
  useEffect(() => {
    loadPreferences();
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        loading,
        error,
        setPreference,
        resetPreferences,
        refreshPreferences: loadPreferences
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};