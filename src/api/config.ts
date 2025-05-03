// src/api/config.ts
import axios, { AxiosHeaders, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// Create a new headers instance
const headers = new AxiosHeaders();

// Set default headers
headers.set('Content-Type', 'application/json');
headers.set('Accept-Language', localStorage.getItem('onnoto-language') || 'et');
headers.set('Cache-Control', 'max-age=300'); // 5 minutes cache

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  headers: headers as AxiosRequestHeaders,
  timeout: 15000, // 15 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get current device ID
    const deviceId = localStorage.getItem('onnoto-device-id');
    if (deviceId) {
      config.headers.set('X-Device-ID', deviceId);
    }

    // Add timestamp to prevent caching where needed
    if (config.method !== 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Handle new device ID from server
    const newDeviceId = response.headers['x-device-id'];
    if (newDeviceId) {
      localStorage.setItem('onnoto-device-id', newDeviceId);
    }

    // Handle cache headers
    const cacheHeader = response.headers['x-cache-ttl'];
    if (cacheHeader) {
      response.headers['cache-control'] = `max-age=${cacheHeader}`;
    }

    return response.data;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // Server responded with non-2xx
      const serverError = error.response.data?.error || error.response.data;
      return Promise.reject(new Error(serverError?.message || 'Server error'));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('No response from server'));
    } else {
      // Request setup error
      return Promise.reject(new Error('Request configuration error'));
    }
  }
);

// Error retry configuration
apiClient.defaults.raxConfig = {
  retry: 3,
  retryDelay: 3000,
  statusCodes: [408, 500, 502, 503, 504],
};

export default apiClient;