export interface Report {
    id: number;
    stationId: string;
    deviceId: string;
    reportType: ReportType;
    description?: string;
    status: ReportStatus;
    createdAt: string;
  }
  
  export enum ReportType {
    OFFLINE = 'OFFLINE',
    DAMAGED = 'DAMAGED',
    INCORRECT_INFO = 'INCORRECT_INFO',
    OCCUPIED = 'OCCUPIED'
  }
  
  export enum ReportStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    RESOLVED = 'RESOLVED',
    REJECTED = 'REJECTED'
  }
  
  export interface ReportRequest {
    stationId: string;
    deviceId?: string;
    reportType: string;
    description?: string;
  }