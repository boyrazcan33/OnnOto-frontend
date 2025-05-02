import client from './client';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { Station } from '../types/station';

/**
 * API client for location-related endpoints
 */
const locationsApi = {
  /**
   * Get stations within a radius of a location
   */
  getNearbyStations: (
    latitude: number,
    longitude: number,
    radiusKm: number = 5
  ) => {
    const radiusMeters = radiusKm * 1000;
    return client.get<Station[]>(API_ENDPOINTS.NEARBY, {
      latitude,
      longitude,
      radiusKm: radiusMeters
    });
  }
};

export default locationsApi;