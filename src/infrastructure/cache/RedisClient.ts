/**
 * FILE:   src/infrastructure/cache/RedisClient.ts
 * LAYER:  infrastructure (adapters; the ONLY file allowed to import ioredis besides realtime/)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The single shared Redis adapter. One connection per process, injected everywhere.
 *   Redis is a cache/coordination layer only - the app must survive total cache loss.
 *
 * WHAT TO WRITE
 *   export class RedisClient {
 *     constructor(config: { url: string; keyPrefix?: string }, logger: ILogger)
 *       - new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 2,
 *                          retryStrategy: (n) => Math.min(n * 200, 2000) })
 *     connect(): Promise<void>
 *     getJson<T>(key: string): Promise<T | null>
 *     setJson(key: string, value: unknown, ttlSeconds: number): Promise<void>   // TTL is REQUIRED
 *     delete(...keys: string[]): Promise<void>
 *     get probe(): IReadinessProbe            // name 'redis', check = PING
 *     get raw(): Redis                        // escape hatch for infra only (Lua scripts, rate-limit store)
 *     close(): Promise<void>                  // quit() for graceful shutdown
 *   }
 *   Key format: `<domain>:<entity>:<id>:<facet>` (e.g. `projects:project:42:summary`).
 *   Never cache without a TTL; never cache unencrypted PII.
 *
 * EXPORTS
 *   class RedisClient
 *
 * USED BY
 *   src/app.ts      `const redis = new RedisClient({ url: config.redis.url }, logger); await redis.connect()`
 *                   rate limiter: `sendCommand: (...args) => redis.raw.call(...args)` passed to createRateLimiter
 *   src/server.ts   shutdown: `await redis.close()` (after DB disconnect)
 *   infrastructure/security/RefreshTokenStore.ts (constructor)
 *   src/modules/healthModule.ts                  `redis.probe`
 *
 * MAY IMPORT
 *   ioredis, domain/interfaces (types).
 */
export {};
