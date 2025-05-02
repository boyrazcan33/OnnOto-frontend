import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';
import { STORAGE_KEYS } from '../constants/storageKeys';
import useAuth from './useAuth'; // Changed from import { useAuth } from './useAuth';
import preferencesApi from '../api/preferencesApi';

interface UsePreferencesResult {
  preferences: Record<string, string>;
  getPreference: (key: string, defaultValue?: string) => string;
  setPreference: (key: string, value: string) => Promise<boolean>;
  loading: boolean;
  error: Error | null;
  refreshPreferences: () => Promise<void>;
}

/**
 * Hook to fetch and manage user preferences
 */
const usePreferences = (): UsePreferencesResult => {
  const { deviceId } = useAuth();
  const [preferences, setPreferences] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPreferences = async () => {
    if (!deviceId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API first
      const data = await preferencesApi.getUserPreferences(deviceId);
      setPreferences(data);
      
      // Cache preferences locally
      setStorageItem(`${STORAGE_KEYS.PREFERENCES_PREFIX}${deviceId}`, data);
    } catch (err) {
      setError(err as Error);
      
      // Fall back to cached preferences if API fails
      const cachedPrefs = getStorageItem<Record<string, string>>(
        `${STORAGE_KEYS.PREFERENCES_PREFIX}${deviceId}`, 
        {}
      );
      
      setPreferences(cachedPrefs);
      console.error('Error fetching preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get a preference value
  const getPreference = (key: string, defaultValue: string = ''): string => {
    return preferences[key] || defaultValue;
  };

  // Set a preference value
  const setPreference = async (key: string, value: string): Promise<boolean> => {
    if (!deviceId) return false;

    try {
      await preferencesApi.savePreference({
        deviceId,
        preferenceKey: key,
        preferenceValue: value
      });
      
      // Update local state
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
      
      // Update local cache
      const currentPrefs = getStorageItem<Record<string, string>>(
        `${STORAGE_KEYS.PREFERENCES_PREFIX}${deviceId}`, 
        {}
      );
      
      setStorageItem(
        `${STORAGE_KEYS.PREFERENCES_PREFIX}${deviceId}`,
        {
          ...currentPrefs,
          [key]: value
        }
      );
      
      return true;
    } catch (err) {
      console.error('Error saving preference:', err);
      return false;
    }
  };

  // Fetch preferences on mount or when deviceId changes
  useEffect(() => {
    fetchPreferences();
  }, [deviceId]);

  return {
    preferences,
    getPreference,
    setPreference,
    loading,
    error,
    refreshPreferences: fetchPreferences
  };
};

export default usePreferences;