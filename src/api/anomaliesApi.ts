import client from './client';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { AnomalyType } from '../types/reliability';

/**
 * API client for anomaly-related endpoints
 */
const anomaliesApi = {
  /**
   * Get all anomalies
   */
  getAllAnomalies: (params?: { unresolved?: boolean, severity?: string, type?: string }) => {
    return client.get<AnomalyType[]>(API_ENDPOINTS.ANOMALIES, params);
  },

  /**
   * Get anomaly by ID
   */
  getAnomalyById: (id: number) => {
    return client.get<AnomalyType>(API_ENDPOINTS.ANOMALY_BY_ID(id));
  },

  /**
   * Get anomalies for a station
   */
  getAnomaliesForStation: (stationId: string, unresolved?: boolean) => {
    return client.get<AnomalyType[]>(API_ENDPOINTS.ANOMALIES_FOR_STATION(stationId), { unresolved });
  },

  /**
   * Get recent anomalies
   */
  getRecentAnomalies: (hours: number = 24) => {
    return client.get<AnomalyType[]>(API_ENDPOINTS.RECENT_ANOMALIES, { hours });
  },

  /**
   * Get stations with most anomalies
   */
  getStationsWithMostAnomalies: (limit: number = 10) => {
    return client.get<any[]>(API_ENDPOINTS.PROBLEMATIC_STATIONS, { limit });
  }
};

export default anomaliesApi;