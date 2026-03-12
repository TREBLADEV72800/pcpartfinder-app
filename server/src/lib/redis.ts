import Redis from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  return null;
};

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis = getRedisUrl()
  ? globalForRedis.redis ??
    new Redis(getRedisUrl()!, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 100, 3000);
      },
    })
  : null;

if (process.env.NODE_ENV !== "production" && redis) {
  globalForRedis.redis = redis;
}

// Helper to check if Redis is available
export const isRedisAvailable = () => redis !== null;
