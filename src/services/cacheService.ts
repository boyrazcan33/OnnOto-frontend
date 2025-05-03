// src/services/cacheService.ts
export class CacheService {
    private cache = new Map<string, any>();
    private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  
    async get<T>(key: string): Promise<T | null> {
      const item = this.cache.get(key);
      if (!item) return null;
  
      if (this.isExpired(item.timestamp)) {
        this.cache.delete(key);
        return null;
      }
  
      return item.data;
    }
  
    async set(key: string, data: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
      this.cache.set(key, {
        data,
        timestamp: Date.now() + ttl
      });
    }
  
    private isExpired(timestamp: number): boolean {
      return Date.now() >= timestamp;
    }
  }