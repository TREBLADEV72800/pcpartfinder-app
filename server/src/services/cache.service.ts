import { redis } from "../lib/redis.js";

// Simple in-memory cache for when Redis is not available
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

function cleanExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt < now) {
      memoryCache.delete(key);
    }
  }
}

setInterval(cleanExpiredEntries, 60000); // Clean every minute

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    // Try Redis first
    if (redis) {
      try {
        const cached = await redis.get(key);
        if (cached) {
          try {
            return JSON.parse(cached) as T;
          } catch {
            return cached as T;
          }
        }
      } catch {
        // Fall through to memory cache
      }
    }

    // Fall back to memory cache
    const entry = memoryCache.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      try {
        return JSON.parse(entry.value) as T;
      } catch {
        return entry.value as T;
      }
    }
    return null;
  },

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);

    // Try Redis first
    if (redis) {
      try {
        if (ttlSeconds) {
          await redis.setex(key, ttlSeconds, serialized);
        } else {
          await redis.set(key, serialized);
        }
        return;
      } catch {
        // Fall through to memory cache
      }
    }

    // Fall back to memory cache
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : Date.now() + 3600000; // Default 1 hour
    memoryCache.set(key, { value: serialized, expiresAt });
  },

  async del(key: string): Promise<void> {
    if (redis) {
      try {
        await redis.del(key);
      } catch {
        // Ignore
      }
    }
    memoryCache.delete(key);
  },

  async delPattern(pattern: string): Promise<void> {
    if (redis) {
      try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
        return;
      } catch {
        // Fall through to memory cache
      }
    }

    // For memory cache, delete all keys that match pattern
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
      }
    }
  },

  async invalidateComponentCache(componentId: string): Promise<void> {
    await this.delPattern(`component:${componentId}*`);
    await this.delPattern(`components:*`);
  },

  async invalidateBuildCache(buildId: string): Promise<void> {
    await this.delPattern(`build:${buildId}*`);
    await this.delPattern(`builds:*`);
  },
};
