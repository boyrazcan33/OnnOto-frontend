import apiClient from './config';
import { getDeviceId } from '../utils/storageUtils';

/**
 * Interceptor that adds the device ID to all requests
 */
const setupDeviceAuthInterceptor = () => {
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
          localStorage.setItem('onnoto-device-id', newDeviceId);
        }
      }
      
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default setupDeviceAuthInterceptor;