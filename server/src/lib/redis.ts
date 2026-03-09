import Redis from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  throw new Error("REDIS_URL is not defined");
};

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(getRedisUrl(), {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 100, 3000);
    },
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    const cached = await redis.get(key);
    if (!cached) return null;
    try {
      return JSON.parse(cached) as T;
    } catch {
      return cached as T;
    }
  },

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, serialized);
    } else {
      await redis.set(key, serialized);
    }
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async delPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
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
