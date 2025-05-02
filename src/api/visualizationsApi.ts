import client from './client';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * API client for visualization-related endpoints
 */
const visualizationsApi = {
  /**
   * Get reliability distribution data
   */
  getReliabilityDistribution: () => {
    return client.get<any>(API_ENDPOINTS.RELIABILITY_DISTRIBUTION);
  },

  /**
   * Get reliability by network
   */
  getReliabilityByNetwork: () => {
    return client.get<any[]>(API_ENDPOINTS.RELIABILITY_NETWORKS);
  },

  /**
   * Get status history for a station
   */
  getStatusHistory: (stationId: string, startDate?: string, endDate?: string) => {
    return client.get<any>(API_ENDPOINTS.STATUS_HISTORY, { 
      stationId, 
      startDate, 
      endDate 
    });
  },

  /**
   * Get anomaly trends
   */
  getAnomalyTrends: (days: number = 30) => {
    return client.get<any>(API_ENDPOINTS.ANOMALY_TRENDS, { days });
  },

  /**
   * Get geographic heatmap data
   */
  getGeographicHeatmap: () => {
    return client.get<any[]>(API_ENDPOINTS.GEOGRAPHIC_HEATMAP);
  },

  /**
   * Get usage patterns
   */
  getUsagePatterns: (stationId?: string) => {
    return client.get<any>(API_ENDPOINTS.USAGE_PATTERNS, { stationId });
  }
};

export default visualizationsApi;