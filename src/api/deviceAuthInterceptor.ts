import apiClient from './config';
import { getDeviceId } from '../utils/storageUtils';

const setupDeviceAuthInterceptor = () => {
  // Request interceptor for API calls
  apiClient.interceptors.request.use(
    async (config) => {
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

  // Response interceptor for API calls
  apiClient.interceptors.response.use(
    (response) => {
      // Handle any new device ID sent from server
      const newDeviceId = response.headers['x-device-id'];
      if (newDeviceId) {
        localStorage.setItem('onnoto-device-id', newDeviceId);
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle device authentication errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newDeviceId = await generateNewDeviceId();
        localStorage.setItem('onnoto-device-id', newDeviceId);
        originalRequest.headers['X-Device-ID'] = newDeviceId;
        return apiClient(originalRequest);
      }

      return Promise.reject(error);
    }
  );
};

const generateNewDeviceId = async () => {
  try {
    const response = await apiClient.post('/api/device/register');
    return response.data.deviceId;
  } catch (error) {
    console.error('Failed to generate device ID:', error);
    throw error;
  }
};

export default setupDeviceAuthInterceptor;