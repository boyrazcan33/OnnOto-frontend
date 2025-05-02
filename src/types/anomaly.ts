export enum AnomalySeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
  }
  
  export enum AnomalyType {
    STATUS_FLAPPING = 'STATUS_FLAPPING',
    EXTENDED_DOWNTIME = 'EXTENDED_DOWNTIME',
    CONNECTOR_MISMATCH = 'CONNECTOR_MISMATCH',
    PATTERN_DEVIATION = 'PATTERN_DEVIATION',
    REPORT_SPIKE = 'REPORT_SPIKE'
  }
  
  export interface Anomaly {
    id: number;
    stationId: string;
    stationName: string;
    anomalyType: AnomalyType;
    description: string;
    severity: AnomalySeverity;
    severityScore: number;
    resolved: boolean;
    detectedAt: string;
    resolvedAt?: string;
    lastChecked?: string;
    metadata?: {
      affectedConnectors?: number[];
      previousStatus?: string;
      thresholdExceeded?: number;
      reportCount?: number;
      patternDetails?: {
        expected: number;
        actual: number;
        deviation: number;
      };
    };
  }
  
  export interface AnomalyStats {
    totalCount: number;
    unresolvedCount: number;
    bySeverity: {
      [key in AnomalySeverity]: number;
    };
    byType: {
      [key in AnomalyType]: number;
    };
    averageSeverityScore: number;
    mostAffectedStations: Array<{
      stationId: string;
      stationName: string;
      anomalyCount: number;
    }>;
  }
  
  export interface AnomalyFilter {
    stationId?: string;
    types?: AnomalyType[];
    severities?: AnomalySeverity[];
    resolved?: boolean;
    startDate?: string;
    endDate?: string;
    minSeverityScore?: number;
  }