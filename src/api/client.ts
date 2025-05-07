import apiClient from './config';

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
    try {
      const response = await apiClient.get<T>(url, { params });
      return response.data;
    } catch (error) {
      console.error(`GET request failed for ${url}:`, error);
      throw error;
    }
  },

  /**
   * Make a POST request
   * @param url - The endpoint URL
   * @param data - Request body
   */
  post: async <T>(url: string, data = {}): Promise<T> => {
    try {
      const response = await apiClient.post<T>(url, data);
      return response.data;
    } catch (error) {
      console.error(`POST request failed for ${url}:`, error);
      throw error;
    }
  },

  /**
   * Make a PUT request
   * @param url - The endpoint URL
   * @param data - Request body
   */
  put: async <T>(url: string, data = {}): Promise<T> => {
    try {
      const response = await apiClient.put<T>(url, data);
      return response.data;
    } catch (error) {
      console.error(`PUT request failed for ${url}:`, error);
      throw error; 
    }
  },

  /**
   * Make a DELETE request
   * @param url - The endpoint URL
   */
  delete: async <T>(url: string): Promise<T> => {
    try {
      const response = await apiClient.delete<T>(url);
      return response.data;
    } catch (error) {
      console.error(`DELETE request failed for ${url}:`, error);
      throw error;
    }
  }
};

export default client;