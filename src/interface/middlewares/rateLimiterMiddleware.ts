/**
 * FILE:   src/interface/middlewares/rateLimiterMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   Factory for Redis-backed rate limiters (shared across instances). One limiter per
 *   concern, each with its own key prefix. Over the limit -> `Retry-After` header (set by
 *   express-rate-limit 8.7.5 when standardHeaders is on) + 429 `RATE_LIMITED` envelope via the
 *   global error handler.
 *   - Key: `options.key(req)` when it returns a value (task 003: the authenticated user id), else
 *     the client IP through `ipKeyGenerator` (IPv6 /56 subnet; required by express-rate-limit 8).
 *   - Store errors are NOT swallowed (passOnStoreError false): Redis down -> 500.
 *   - Never import ioredis or RedisClient here (boundaries): the composition root injects sendCommand.
 *
 * EXPORTS
 *   function createRateLimiter, interface IRateLimiterOptions
 *
 * USED BY
 *   src/app.ts   global limiter `{ prefix: 'rl:global:', windowMs: 60_000, limit: 300 }`, and
 *                `shared.http.createRateLimiter` (sendCommand pre-bound) for feature modules
 *
 * MAY IMPORT
 *   express (types), express-rate-limit, rate-limit-redis, domain/errors/*.
 */
import type { Request, RequestHandler } from 'express';
import { ipKeyGenerator, rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import type { RedisReply } from 'rate-limit-redis';
import { AppError } from '../../domain/errors/AppError';
import { ERROR_CODES } from '../../domain/errors/errorCodes';

export interface IRateLimiterOptions {
  prefix: string;
  windowMs: number;
  limit: number;
  sendCommand: (...args: string[]) => Promise<RedisReply>;
  /** Seam for per-user limits: return a stable key, or undefined to fall back to the client IP. */
  key?: (req: Request) => string | undefined;
}

export function createRateLimiter(options: IRateLimiterOptions): RequestHandler {
  const { prefix, windowMs, limit, sendCommand, key } = options;
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store: new RedisStore({ prefix, sendCommand }),
    keyGenerator: (req) => key?.(req) ?? ipKeyGenerator(req.ip ?? 'unknown'),
    handler: (_req, _res, next) => next(new AppError(ERROR_CODES.RATE_LIMITED, 'Too many requests', 429)),
  });
}
