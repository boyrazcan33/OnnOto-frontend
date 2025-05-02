// Basic analytics events tracking
export enum AnalyticsEvent {
    PAGE_VIEW = 'PAGE_VIEW',
    STATION_VIEW = 'STATION_VIEW',
    REPORT_SUBMIT = 'REPORT_SUBMIT',
    FILTER_APPLY = 'FILTER_APPLY',
    SEARCH_PERFORM = 'SEARCH_PERFORM',
    ERROR_OCCUR = 'ERROR_OCCUR',
    MAP_INTERACTION = 'MAP_INTERACTION',
    FAVORITE_TOGGLE = 'FAVORITE_TOGGLE'
  }
  
  interface AnalyticsData {
    timestamp: number;
    deviceId?: string;
    sessionId?: string;
    [key: string]: any;
  }
  
  class AnalyticsService {
    private readonly STORAGE_KEY = 'onnoto-analytics';
    private readonly BATCH_SIZE = 10;
    private queue: Array<{ event: AnalyticsEvent; data: AnalyticsData }> = [];
    private sessionId: string;
  
    constructor() {
      this.sessionId = this.generateSessionId();
      this.loadQueueFromStorage();
      window.addEventListener('beforeunload', () => this.saveQueueToStorage());
    }
  
    private generateSessionId(): string {
      return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  
    private loadQueueFromStorage(): void {
      try {
        const savedQueue = localStorage.getItem(this.STORAGE_KEY);
        if (savedQueue) {
          this.queue = JSON.parse(savedQueue);
        }
      } catch (error) {
        console.error('Failed to load analytics queue:', error);
      }
    }
  
    private saveQueueToStorage(): void {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
      } catch (error) {
        console.error('Failed to save analytics queue:', error);
      }
    }
  
    private async sendBatch(): Promise<void> {
      if (this.queue.length === 0) return;
  
      try {
        const batch = this.queue.splice(0, this.BATCH_SIZE);
        // In real implementation, send to analytics backend
        console.log('Sending analytics batch:', batch);
        // await analyticsApi.sendBatch(batch);
      } catch (error) {
        console.error('Failed to send analytics batch:', error);
        // Put failed events back in queue
        this.queue.unshift(...this.queue.splice(0, this.BATCH_SIZE));
      }
    }
  
    public trackEvent(event: AnalyticsEvent, data: Omit<AnalyticsData, 'timestamp' | 'sessionId'>): void {
      this.queue.push({
        event,
        data: {
          ...data,
          timestamp: Date.now(),
          sessionId: this.sessionId
        }
      });
  
      if (this.queue.length >= this.BATCH_SIZE) {
        this.sendBatch();
      }
    }
  
    public async flush(): Promise<void> {
      await this.sendBatch();
    }
  }
  
  export const analyticsService = new AnalyticsService();