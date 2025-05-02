interface CacheConfig {
    name: string;
    version: number;
    maxAge: number;
  }
  
  class OfflineService {
    private isOnline: boolean = navigator.onLine;
    private listeners: Set<(online: boolean) => void> = new Set();
    private cacheConfigs: Map<string, CacheConfig> = new Map();
  
    constructor() {
      window.addEventListener('online', () => this.handleOnlineStatus(true));
      window.addEventListener('offline', () => this.handleOnlineStatus(false));
  
      // Default cache configurations
      this.cacheConfigs.set('stations', {
        name: 'stations-cache',
        version: 1,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });
  
      this.cacheConfigs.set('images', {
        name: 'images-cache',
        version: 1,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }
  
    private handleOnlineStatus(online: boolean): void {
      this.isOnline = online;
      this.notifyListeners();
    }
  
    public isNetworkAvailable(): boolean {
      return this.isOnline;
    }
  
    public addStatusListener(listener: (online: boolean) => void): void {
      this.listeners.add(listener);
    }
  
    public removeStatusListener(listener: (online: boolean) => void): void {
      this.listeners.delete(listener);
    }
  
    private notifyListeners(): void {
      this.listeners.forEach(listener => listener(this.isOnline));
    }
  
    public async cacheData(key: string, data: any): Promise<void> {
      const config = this.cacheConfigs.get(key);
      if (!config) {
        throw new Error(`No cache configuration found for key: ${key}`);
      }
  
      try {
        const cache = await caches.open(config.name);
        const response = new Response(JSON.stringify({
          data,
          timestamp: Date.now(),
          version: config.version
        }));
        await cache.put(`/${key}`, response);
      } catch (error) {
        console.error(`Failed to cache data for ${key}:`, error);
      }
    }
  
    public async getCachedData<T>(key: string): Promise<T | null> {
      const config = this.cacheConfigs.get(key);
      if (!config) {
        throw new Error(`No cache configuration found for key: ${key}`);
      }
  
      try {
        const cache = await caches.open(config.name);
        const response = await cache.match(`/${key}`);
        
        if (!response) return null;
  
        const { data, timestamp, version } = await response.json();
        
        // Check if cache is expired or version mismatch
        if (
          version !== config.version ||
          Date.now() - timestamp > config.maxAge
        ) {
          await cache.delete(`/${key}`);
          return null;
        }
  
        return data as T;
      } catch (error) {
        console.error(`Failed to get cached data for ${key}:`, error);
        return null;
      }
    }
  
    public async clearCache(key?: string): Promise<void> {
      if (key) {
        const config = this.cacheConfigs.get(key);
        if (config) {
          await caches.delete(config.name);
        }
      } else {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
    }
  }
  
  export const offlineService = new OfflineService();