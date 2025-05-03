// src/types/station.ts
import { Connector } from './connector';

export interface Station {
  id: string;
  name: string;
  networkName: string;
  networkId?: string;
  operatorName: string;
  operatorId?: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  reliabilityScore: number;
  availableConnectors: number;
  totalConnectors: number;
  lastStatusUpdate: string;
  connectors: Connector[]; // Added this property
  status?: string; // Added this property for stationsSlice.ts
}

export interface StationDetail extends Station {
  connectors: Connector[];
  reliability?: {
    uptimePercentage: number;
    reportCount: number;
    averageReportSeverity?: number;
    lastDowntime?: string;
    downtimeFrequency?: number;
    sampleSize: number;
  };
}

// Add the missing types
export interface Anomaly {
  id: string;
  type: string;
  description: string;
  severity: string;
  timestamp: string;
}

export enum StationStatus {
  OPERATIONAL = 'OPERATIONAL',
  PARTIAL = 'PARTIAL',
  OFFLINE = 'OFFLINE',
  UNKNOWN = 'UNKNOWN'
}

export interface StationMetrics {
  reliability: number;
  status: StationStatus;
  lastUpdate: string;
}