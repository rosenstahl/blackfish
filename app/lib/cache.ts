type CacheOptions = {
  maxAge?: number; // in milliseconds
  maxSize?: number; // maximum number of items
};

type CacheItem<T> = {
  value: T;
  timestamp: number;
};

class Cache<T = any> {
  private cache: Map<string, CacheItem<T>>;
  private maxAge: number;
  private maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.maxAge = options.maxAge || 5 * 60 * 1000; // 5 minutes default
    this.maxSize = options.maxSize || 100;
  }

  set(key: string, value: T): void {
    // Clean expired items first
    this.cleanup();

    // Remove oldest item if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);

    if (!item) {
      return undefined;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Create cache instances for different purposes
export const apiCache = new Cache<any>({ maxAge: 5 * 60 * 1000 }); // 5 minutes
export const staticCache = new Cache<any>({ maxAge: 60 * 60 * 1000 }); // 1 hour
export const userCache = new Cache<any>({ maxAge: 30 * 60 * 1000 }); // 30 minutes