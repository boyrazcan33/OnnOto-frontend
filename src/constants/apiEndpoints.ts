const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  // Station endpoints
  STATIONS: `${API_BASE_URL}/stations`,
  STATION_BY_ID: (id: string) => `${API_BASE_URL}/stations/${id}`,
  STATION_FILTER: `${API_BASE_URL}/stations/filter`,
  STATIONS_BY_CITY: (city: string) => `${API_BASE_URL}/stations/city/${city}`,
  NEARBY_STATIONS: `${API_BASE_URL}/stations/nearby`,
  
  // Connector endpoints
  CONNECTORS_BY_STATION: (stationId: string) => `${API_BASE_URL}/connectors/station/${stationId}`,
  CONNECTOR_BY_ID: (id: number) => `${API_BASE_URL}/connectors/${id}`,
  CONNECTORS_BY_TYPE: (type: string) => `${API_BASE_URL}/connectors/type/${type}`,
  
  // Reliability endpoints
  STATION_RELIABILITY: (stationId: string) => `${API_BASE_URL}/reliability/station/${stationId}`,
  MOST_RELIABLE_STATIONS: `${API_BASE_URL}/reliability/most-reliable`,
  MINIMUM_RELIABILITY: `${API_BASE_URL}/reliability/minimum-reliability`,
  
  // Report endpoints
  REPORTS: `${API_BASE_URL}/reports`,
  REPORT_COUNT: (stationId: string) => `${API_BASE_URL}/reports/count/station/${stationId}`,
  
  // Preferences endpoints
  PREFERENCES: `${API_BASE_URL}/preferences`,
  PREFERENCES_BY_DEVICE: (deviceId: string) => `${API_BASE_URL}/preferences/${deviceId}`,
  PREFERENCE_BY_KEY: (deviceId: string, key: string) => `${API_BASE_URL}/preferences/${deviceId}/${key}`,
  
  // Location endpoints
  NEARBY: `${API_BASE_URL}/locations/nearby`,

  // Health endpoint
  HEALTH: `${API_BASE_URL}/health`
};