import client from './client';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { Connector } from '../types/connector';

/**
 * API client for connector-related endpoints
 */
const connectorsApi = {
  /**
   * Get connectors by station ID
   */
  getConnectorsByStationId: (stationId: string) => {
    return client.get<Connector[]>(API_ENDPOINTS.CONNECTORS_BY_STATION(stationId));
  },

  /**
   * Get connector by ID
   */
  getConnectorById: (id: number) => {
    return client.get<Connector>(API_ENDPOINTS.CONNECTOR_BY_ID(id));
  },

  /**
   * Get connectors by type
   */
  getConnectorsByType: (type: string) => {
    return client.get<Connector[]>(API_ENDPOINTS.CONNECTORS_BY_TYPE(type));
  }
};

export default connectorsApi;