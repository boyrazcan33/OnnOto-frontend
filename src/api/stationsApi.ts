import client from './client';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { Station, StationDetail } from '../types/station';
import { StationFilterRequest } from '../types/filters';

/**
 * API client for station-related endpoints
 */
const stationsApi = {
  /**
   * Get all stations
   */
  getAllStations: () => {
    return client.get<Station[]>(API_ENDPOINTS.STATIONS);
  },

  /**
   * Get station by ID
   */
  getStationById: (id: string) => {
    return client.get<StationDetail>(API_ENDPOINTS.STATION_BY_ID(id));
  },

  /**
   * Filter stations by criteria
   */
  filterStations: (filterRequest: StationFilterRequest) => {
    return client.post<Station[]>(API_ENDPOINTS.STATION_FILTER, filterRequest);
  },

  /**
   * Get stations by city
   */
  getStationsByCity: (city: string) => {
    return client.get<Station[]>(API_ENDPOINTS.STATIONS_BY_CITY(city));
  },

  /**
   * Get nearby stations
   */
  getNearbyStations: (
    latitude: number,
    longitude: number,
    radius?: number,
    limit?: number
  ) => {
    return client.get<Station[]>(API_ENDPOINTS.NEARBY_STATIONS, {
      params: {
        latitude,
        longitude,
        radius: radius || 5000, // Default 5km
        limit: limit || 10      // Default 10 stations
      }
    });
  }
};

export default stationsApi;