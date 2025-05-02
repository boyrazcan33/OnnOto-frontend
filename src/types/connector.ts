export interface Connector {
    id: number;
    stationId: string;
    stationName: string;
    connectorType: string;
    powerKw: number;
    currentType: string;
    status: ConnectorStatus;
    lastStatusUpdate: string;
  }
  
  export enum ConnectorStatus {
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED',
    OFFLINE = 'OFFLINE',
    UNKNOWN = 'UNKNOWN'
  }