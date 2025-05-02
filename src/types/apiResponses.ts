import { Station, StationDetail } from './station';
import { Connector } from './connector';
import { Anomaly } from './anomaly';
import { ReliabilityMetric } from './reliability';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface StationsResponse extends PaginatedResponse<Station> {
  filters?: {
    appliedFilters: Record<string, any>;
    availableNetworks: string[];
    availableCities: string[];
  };
}

export interface StationDetailResponse {
  station: StationDetail;
  connectors: Connector[];
  reliability?: ReliabilityMetric;
  anomalies: Anomaly[];
}

export interface VisualizationResponse {
  data: any;
  metadata: {
    startDate?: string;
    endDate?: string;
    resolution?: string;
    aggregationType?: string;
    filters?: Record<string, any>;
  };
}

export interface ReliabilityDistributionResponse {
  ranges: Array<{
    min: number;
    max: number;
    count: number;
    percentage: number;
  }>;
  total: number;
  average: number;
}

export interface NetworkReliabilityResponse {
  networkId: string;
  networkName: string;
  averageReliability: number;
  stationCount: number;
  reliability?: {
    uptime: number;
    avgReportCount: number;
    avgDowntime: number;
  };
}

export interface GeographicHeatmapResponse {
  points: Array<{
    latitude: number;
    longitude: number;
    weight: number;
    stationId: string;
  }>;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface PreferenceResponse {
  deviceId: string;
  preferences: Record<string, string>;
  lastUpdated: string;
}

export interface BatchOperationResponse {
  success: boolean;
  processed: number;
  failed: number;
  errors?: ApiError[];
}