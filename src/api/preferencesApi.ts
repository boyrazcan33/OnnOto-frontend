import client from './client';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * API client for user preference-related endpoints
 */
const preferencesApi = {
  /**
   * Save a user preference
   */
  savePreference: (request: { deviceId: string; preferenceKey: string; preferenceValue: string }) => {
    return client.post(API_ENDPOINTS.PREFERENCES, request);
  },

  /**
   * Get all preferences for a user
   */
  getUserPreferences: (deviceId: string) => {
    return client.get<Record<string, string>>(API_ENDPOINTS.PREFERENCES_BY_DEVICE(deviceId));
  },

  /**
   * Get a specific preference
   */
  getUserPreference: (deviceId: string, key: string) => {
    return client.get<string>(API_ENDPOINTS.PREFERENCE_BY_KEY(deviceId, key));
  }
};

export default preferencesApi;