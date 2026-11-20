/**
 * FILE:   src/infrastructure/cache/RedisClient.ts
 * LAYER:  infrastructure (adapters; the ONLY file allowed to import ioredis besides realtime/)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   The single shared Redis adapter. One connection per process, injected everywhere.
 *   Redis is a cache/coordination layer only - the app must survive total cache loss.
 *   Key format: `<domain>:<entity>:<id>:<facet>`. Never cache without a TTL (setJson requires one);
 *   never cache unencrypted PII.
 *
 * EXPORTS
 *   class RedisClient { connect, getJson, setJson(key, value, ttlSeconds), delete, probe, raw, close }
 *
 * USED BY
 *   src/app.ts (built once; `raw.call` feeds the rate-limit store), src/server.ts (close on shutdown),
 *   src/modules/healthModule.ts (`redis.probe`), task 003: RefreshTokenStore
 *
 * MAY IMPORT
 *   ioredis, domain/interfaces (types).
 */
import { Redis } from 'ioredis';
import type { ILogger } from '../../domain/interfaces/ILogger';
import type { IReadinessProbe } from '../../domain/interfaces/IReadinessProbe';

export class RedisClient {
  private readonly _redis: Redis;

  constructor(config: { url: string; keyPrefix?: string }, logger: ILogger) {
    this._redis = new Redis(config.url, {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
      retryStrategy: (attempt: number) => Math.min(attempt * 200, 2000),
      ...(config.keyPrefix ? { keyPrefix: config.keyPrefix } : {}),
    });
    // Without a listener ioredis reports connection errors on stderr; route them through ILogger.
    this._redis.on('error', (err: Error) => logger.warn('redis.error', { message: err.message }));
  }

  async connect(): Promise<void> {
    await this._redis.connect();
  }

  async getJson<T>(key: string): Promise<T | null> {
    const value = await this._redis.get(key);
    return value === null ? null : (JSON.parse(value) as T);
  }

  async setJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!Number.isInteger(ttlSeconds) || ttlSeconds <= 0) {
      throw new Error('RedisClient.setJson requires a positive integer TTL in seconds');
    }
    await this._redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async delete(...keys: string[]): Promise<void> {
    if (keys.length > 0) await this._redis.del(...keys);
  }

  get probe(): IReadinessProbe {
    return {
      name: 'redis',
      check: async (): Promise<void> => {
        const reply = await this._redis.ping();
        if (reply !== 'PONG') throw new Error('unexpected PING reply');
      },
    };
  }

  /** Escape hatch for infrastructure only (Lua scripts, rate-limit store). */
  get raw(): Redis {
    return this._redis;
  }

  async close(): Promise<void> {
    if (this._redis.status === 'end') return;
    try {
      await this._redis.quit();
    } catch {
      this._redis.disconnect();
    }
  }
}
