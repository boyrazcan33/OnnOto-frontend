import client from '../api/client';
import apiClient from '../api/config';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { getDeviceId, generateDeviceId, setStorageItem } from '../utils/storageUtils';
import { STORAGE_KEYS } from '../constants/storageKeys';

/**
 * Service for handling device authentication
 */
const authService = {
  /**
   * Get the current device ID or create a new one
   */
  getDeviceId: (): string => {
    return getDeviceId();
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
        setStorageItem(STORAGE_KEYS.DEVICE_ID, response.deviceId);
        return response.deviceId;
      }
      
      // If no ID is returned, generate one locally
      const newId = generateDeviceId();
      setStorageItem(STORAGE_KEYS.DEVICE_ID, newId);
      return newId;
    } catch (error) {
      console.error('Failed to register device:', error);
      
      // Generate a local ID on failure
      const newId = generateDeviceId();
      setStorageItem(STORAGE_KEYS.DEVICE_ID, newId);
      return newId;
    }
  },
  
  /**
   * Set up authentication interceptors
   */
  setupInterceptors: () => {
    // Request interceptor to add device ID to all requests
    apiClient.interceptors.request.use(
      (config) => {
        const deviceId = getDeviceId();
        
        if (deviceId) {
          config.headers = config.headers || {};
          config.headers['X-Device-ID'] = deviceId;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to capture device ID from responses
    apiClient.interceptors.response.use(
      (response) => {
        // Check if a new device ID has been provided
        const newDeviceId = response.headers['x-device-id'];
        
        if (newDeviceId) {
          const currentDeviceId = getDeviceId();
          
          // If the IDs don't match, update the stored ID
          if (currentDeviceId !== newDeviceId) {
            setStorageItem(STORAGE_KEYS.DEVICE_ID, newDeviceId);
          }
        }
        
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  },
};

export default authService;