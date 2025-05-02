import apiClient from './config';
import { getDeviceId } from '../utils/storageUtils';

/**
 * Base API client with methods for common HTTP requests
 */
const client = {
  /**
   * Make a GET request
   * @param url - The endpoint URL
   * @param params - Query parameters
   */
  get: async <T>(url: string, params = {}): Promise<T> => {
    const response = await apiClient.get<T>(url, { params });
    return response.data;
  },

  /**
   * Make a POST request
   * @param url - The endpoint URL
   * @param data - Request body
   */
  post: async <T>(url: string, data = {}): Promise<T> => {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  },

  /**
   * Make a PUT request
   * @param url - The endpoint URL
   * @param data - Request body
   */
  put: async <T>(url: string, data = {}): Promise<T> => {
    const response = await apiClient.put<T>(url, data);
    return response.data;
  },

  /**
   * Make a DELETE request
   * @param url - The endpoint URL
   */
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<T>(url);
    return response.data;
  }
};

export default client;