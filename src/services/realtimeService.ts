// src/services/realtimeService.ts
import store from '../store'; // Changed from { store }
// For now, we're assuming actions.ts will be created as a separate fix
import { 
  updateStationStatus, 
  updateReliabilityScore, 
  handleAnomalyDetection 
} from '../store/actions';
import { StationStatus, Anomaly, StationMetrics } from '../types/station';

interface WebSocketMessage {
  type: string;
  payload: any;
  stationId: string;
}

export class RealtimeService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_DELAY = 1000;
  private subscribers = new Map<string, Set<(data: any) => void>>();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeWebSocket();
    }
  }

  private initializeWebSocket() {
    const wsUrl = process.env.REACT_APP_WS_URL;
    if (!wsUrl) {
      console.error('WebSocket URL not defined');
      return;
    }

    try {
      this.ws = new WebSocket(wsUrl);
      this.setupWebSocketHandlers();
    } catch (error) {
      console.error('WebSocket initialization error:', error);
      this.handleDisconnect();
    }
  }

  private setupWebSocketHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data.toString());
        this.handleMessage(message);
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    this.ws.onclose = this.handleDisconnect.bind(this);
    this.ws.onerror = this.handleError.bind(this);
  }

  private handleDisconnect() {
    if (this.reconnectAttempts < this.MAX_RECONNECT_ATTEMPTS) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.initializeWebSocket();
      }, this.RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts));
    }
  }

  private handleError(error: Event) {
    console.error('WebSocket error:', error);
  }

  private handleMessage(message: WebSocketMessage) {
    const { type, payload, stationId } = message;

    // Notify subscribers
    const subscribers = this.subscribers.get(stationId);
    if (subscribers) {
      subscribers.forEach(callback => callback(message));
    }

    // Update global state
    switch (type) {
      case 'STATION_STATUS':
        store.dispatch(updateStationStatus({
          stationId,
          status: payload.status as StationStatus
        }));
        break;

      case 'RELIABILITY_UPDATE':
        store.dispatch(updateReliabilityScore({
          stationId,
          metrics: payload as StationMetrics
        }));
        break;

      case 'ANOMALY_DETECTED':
        store.dispatch(handleAnomalyDetection({
          stationId,
          anomaly: payload as Anomaly
        }));
        break;
    }
  }

  public subscribe(stationId: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(stationId)) {
      this.subscribers.set(stationId, new Set());
    }
    
    this.subscribers.get(stationId)?.add(callback);

    return () => {
      const subscribers = this.subscribers.get(stationId);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(stationId);
        }
      }
    };
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }
}

export const realtimeService = new RealtimeService();