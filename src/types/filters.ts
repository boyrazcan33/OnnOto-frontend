export interface StationFilterRequest {
    networkIds?: string[];
    connectorTypes?: string[];
    statuses?: string[];
    minimumReliability?: number;
    city?: string;
    limit?: number;
    offset?: number;
  }
  
  export interface NearbyRequest {
    latitude: number;
    longitude: number;
    radiusInMeters?: number;
    limit?: number;
    filters?: StationFilterRequest;
  }
  
  export interface FilterState {
    networks: string[];
    connectorTypes: string[];
    statuses: string[];
    minimumReliability: number;
    city?: string;
    showOnlyAvailable: boolean;
    showOnlyFavorites: boolean;
    searchRadius: number;
  }