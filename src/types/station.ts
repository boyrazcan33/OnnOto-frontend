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

