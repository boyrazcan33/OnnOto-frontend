// Modified src/api/client.ts to handle production environment
import axios, { AxiosHeaders, AxiosRequestHeaders, InternalAxiosRequestConfig } from 'axios';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { getDeviceId } from '../utils/storageUtils';

// Create a new headers instance
const headers = new AxiosHeaders();

// Get language from local storage with fallback
const storedLanguage = localStorage.getItem('onnoto-language') || 'et';

// Set default headers
headers.set('Content-Type', 'application/json');
headers.set('Accept-Language', storedLanguage);
headers.set('Cache-Control', 'max-age=300'); // 5 minutes cache

// Helper to get API URL - working around process.env issues
const getApiBaseUrl = () => {
  // First check if we have runtime environment variables from the _env_ object
  if (window._env_ && window._env_.REACT_APP_API_URL) {
    return window._env_.REACT_APP_API_URL;
  }
  
  // Then check for build-time environment variables
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In production, use the default Railway API URL
  if (process.env.NODE_ENV === 'production') {
    return 'https://onnoto-backend-production.up.railway.app/api';
  }
  
  // Default to relative path that will work with the proxy
  return '/api';
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: headers as AxiosRequestHeaders,
  timeout: 15000, // 15 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get current device ID - This is the only place we should handle device ID
    const deviceId = getDeviceId();
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

    // Log requests in development mode
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
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

    // Log responses in development mode
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }

    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // Server responded with non-2xx
      const serverError = error.response.data?.error || error.response.data;
      
      // Log errors in development mode
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.error(`[API Error] ${error.response.status} ${error.config?.url}`, serverError);
      }
      
      return Promise.reject(new Error(serverError?.message || `Server error: ${error.response.status}`));
    } else if (error.request) {
      // Request made but no response
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.error('[API Error] No response from server', error.request);
      }
      
      // In development, provide a more user-friendly message and suggest using mock data
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.warn('Backend server may not be running. Consider using mock data in development.');
      }
      
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Request setup error
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.error('[API Error] Request configuration error', error.message);
      }
      
      return Promise.reject(new Error(`Request configuration error: ${error.message}`));
    }
  }
);

// Helper function to add simple GET, POST methods
const client = {
  get: async <T>(endpoint: string, params?: any): Promise<T> => {
    // Send params directly, not nested in "params" object
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  },
  post: async <T>(endpoint: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.post(endpoint, data, config);
    return response.data;
  },
  put: async <T>(endpoint: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.put(endpoint, data, config);
    return response.data;
  },
  delete: async <T>(endpoint: string, config?: any): Promise<T> => {
    const response = await apiClient.delete(endpoint, config);
    return response.data;
  }
};

// Add _env_ to Window interface
declare global {
  interface Window {
    _env_?: {
      REACT_APP_API_URL?: string;
      REACT_APP_DEFAULT_LANGUAGE?: string;
      REACT_APP_GOOGLE_MAPS_API_KEY?: string;
      REACT_APP_MAP_ID?: string;
      REACT_APP_WS_URL?: string;
      [key: string]: string | undefined;
    };
  }
}

export default client;