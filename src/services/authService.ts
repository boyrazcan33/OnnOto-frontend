import client from '../api/client';
import apiClient from '../api/config';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { getDeviceId } from '../utils/storageUtils';
import { STORAGE_KEYS } from '../constants/storageKeys';

/**
 * Service for handling device authentication
 */
const authService = {
  /**
   * Get the current device ID
   */
  getDeviceId: (): string => {
    return getDeviceId() || '';
  },
  
  /**
   * Register the device with the backend
   * @param languagePreference - User's language preference
   */
  registerDevice: async (languagePreference?: string): Promise<string> => {
    try {
      // The backend will generate a new device ID if none is provided
      const response = await client.post<{ deviceId: string }>(API_ENDPOINTS.PREFERENCES, {
        deviceId: getDeviceId() || undefined,
        preferenceKey: 'language',
        preferenceValue: languagePreference || 'et',
      });
      
      if (response && response.deviceId) {
        localStorage.setItem(STORAGE_KEYS.DEVICE_ID, response.deviceId);
        return response.deviceId;
      }
      
      // If no ID is returned, generate one locally
      const newId = generateDeviceId();
      localStorage.setItem(STORAGE_KEYS.DEVICE_ID, newId);
      return newId;
    } catch (error) {
      console.error('Failed to register device:', error);
      
      // Generate a local ID on failure
      const newId = generateDeviceId();
      localStorage.setItem(STORAGE_KEYS.DEVICE_ID, newId);
      return newId;
    }
  }
};

// Helper function to generate a device ID
const generateDeviceId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default authService;