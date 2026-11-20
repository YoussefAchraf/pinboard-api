/**
 * FILE:   src/interface/middlewares/rateLimiterMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Factory for Redis-backed rate limiters (shared across instances). One limiter per
 *   concern, each with its own key prefix.
 *
 * WHAT TO WRITE
 *   export interface IRateLimiterOptions {
 *     prefix: string;               // 'rl:global:', 'rl:login:' ...
 *     windowMs: number;
 *     limit: number;
 *     sendCommand: (...args: string[]) => Promise<unknown>;   // injected: redis.raw.call
 *   }
 *   export function createRateLimiter(o: IRateLimiterOptions): RequestHandler
 *     -> rateLimit({ windowMs, limit, standardHeaders: 'draft-7', legacyHeaders: false,
 *          store: new RedisStore({ prefix, sendCommand }),
 *          keyGenerator: (req) => req.auth?.userId ?? req.ip,
 *          handler: (_req, _res, next) => next(new AppError(ERROR_CODES.RATE_LIMITED, 'Too many requests', 429)) })
 *   - Never import ioredis or RedisClient here (boundaries): the composition root adapts it.
 *   - Verify express-rate-limit / rate-limit-redis option names against the pinned versions.
 *
 * EXPORTS
 *   function createRateLimiter, interface IRateLimiterOptions
 *
 * USED BY
 *   src/app.ts                 global limiter: `app.use(createRateLimiter({ prefix: 'rl:global:', windowMs: 60_000, limit: 300, sendCommand }))`
 *   src/modules/authModule.ts  login limiter:  `createRateLimiter({ prefix: 'rl:login:', windowMs: 15 * 60_000, limit: 10, sendCommand })`
 *
 * MAY IMPORT
 *   express (types), express-rate-limit, rate-limit-redis, domain/errors/*.
 */
export {};
