import axios from 'axios';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
});

export default apiClient;