import Redis from 'ioredis';
import { ENV } from './env';
import { logger } from '../utils/logger';

// In-memory fallback for local dev when Redis is not provided
class InMemoryCache {
  private store = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK'> {
    let expiresAt: number | undefined;
    if (mode === 'EX' && duration) {
      expiresAt = Date.now() + duration * 1000;
    }
    this.store.set(key, { value, expiresAt });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const next = current ? parseInt(current, 10) + 1 : 1;
    const item = this.store.get(key);
    this.store.set(key, { value: next.toString(), expiresAt: item?.expiresAt });
    return next;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (!item) return 0;
    item.expiresAt = Date.now() + seconds * 1000;
    return 1;
  }

  async ttl(key: string): Promise<number> {
    const item = this.store.get(key);
    if (!item || !item.expiresAt) return -1;
    const remaining = Math.ceil((item.expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }
}

let redisClient: Redis | InMemoryCache;
let redisPubClient: Redis | null = null;
let redisSubClient: Redis | null = null;

if (ENV.REDIS_URL && ENV.REDIS_URL.trim() !== '') {
  try {
    logger.info('Connecting to Redis cluster at ' + ENV.REDIS_URL.split('@').pop());
    redisClient = new Redis(ENV.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 100, 3000)
    });

    redisPubClient = new Redis(ENV.REDIS_URL);
    redisSubClient = redisPubClient.duplicate();

    redisClient.on('connect', () => logger.info('Redis client connected successfully'));
    redisClient.on('error', (err) => logger.warn('Redis connection warning:', err.message));
  } catch (err) {
    logger.warn('Failed to initialize Redis, falling back to in-memory store:', err);
    redisClient = new InMemoryCache();
  }
} else {
  logger.info('REDIS_URL not configured. Using high-performance in-memory cache for local development.');
  redisClient = new InMemoryCache();
}

export { redisClient, redisPubClient, redisSubClient };
