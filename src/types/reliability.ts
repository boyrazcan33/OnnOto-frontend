export interface ReliabilityMetric {
    stationId: string;
    uptimePercentage: number;
    reportCount: number;
    averageReportSeverity?: number;
    lastDowntime?: string;
    downtimeFrequency?: number;
    sampleSize: number;
  }
  
  export interface AnomalyType {
    id: number;
    stationId: string;
    stationName: string;
    anomalyType: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    severityScore: number;
    resolved: boolean;
    detectedAt: string;
    resolvedAt?: string;
    lastChecked?: string;
  }