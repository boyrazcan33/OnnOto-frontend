import apiClient from './config';

/**
 * Sets up device authentication handling for API calls
 * This only handles registration of new device IDs if authentication fails
 * The actual device ID inclusion in requests is handled by config.ts
 */
const setupDeviceAuthInterceptor = () => {
  // Response interceptor for API calls to handle auth failures
  apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle device authentication errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Try to generate a new device ID
          const newDeviceId = await generateNewDeviceId();
          
          // Store the new device ID
          localStorage.setItem('onnoto-device-id', newDeviceId);
          
          // Update header for the retry
          originalRequest.headers['X-Device-ID'] = newDeviceId;
          
          // Retry the request
          return apiClient(originalRequest);
        } catch (regError) {
          console.error('Failed to register device:', regError);
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

/**
 * Register a new device with the server
 */
const generateNewDeviceId = async () => {
  try {
    const response = await apiClient.post('/api/device/register');
    return response.data.deviceId;
  } catch (error) {
    console.error('Failed to generate device ID:', error);
    // Fall back to client-side ID generation if server fails
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};

export default setupDeviceAuthInterceptor;