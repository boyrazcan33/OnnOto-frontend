import client from './client';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { ReliabilityMetric } from '../types/reliability';

/**
 * API client for reliability-related endpoints
 */
const reliabilityApi = {
  /**
   * Get reliability metrics for a station
   */
  getStationReliability: (stationId: string) => {
    return client.get<ReliabilityMetric>(API_ENDPOINTS.STATION_RELIABILITY(stationId));
  },

  /**
   * Get the most reliable stations
   */
  getMostReliableStations: (limit: number = 10) => {
    return client.get<ReliabilityMetric[]>(API_ENDPOINTS.MOST_RELIABLE_STATIONS, { limit });
  },

  /**
   * Get stations with a minimum reliability score
   */
  getStationsWithMinimumReliability: (minimumReliability: number) => {
    return client.get<ReliabilityMetric[]>(API_ENDPOINTS.MINIMUM_RELIABILITY, { 
      minimumReliability 
    });
  }
};

export default reliabilityApi;