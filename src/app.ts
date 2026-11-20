/**
 * FILE:   src/app.ts
 * LAYER:  composition root (may import every layer). Owns the APPLICATION WIRING, not the process.
 * STATUS: implemented (task 001) - task 003 adds the auth adapters (unit of work, users repository,
 *         security services), authMiddleware and the global csrfMiddleware.
 *
 * PURPOSE
 *   `buildApp()` is the dependency-injection container: it builds every SHARED adapter once,
 *   applies the global middleware chain, mounts the feature modules, and returns the app.
 *   Tests call it directly (no listening socket) - see tests/helpers/buildTestApp.ts.
 *
 * CHAIN (order matters)
 *   requestContext -> pino-http -> unversioned modules (/health, /ready)
 *   -> helmet -> cors (allow-list, credentials) -> express.json(limit) -> cookieParser -> sanitize
 *   -> global limiter (rl:global:, 300/min per IP) -> /api-docs (not in production)
 *   -> /v1/<module> routers -> notFound -> errorHandler (LAST)
 *
 * NEVER PUT HERE
 *   Route handlers, business rules, SQL, cache reads, feature-specific `new UseCase(...)`
 *   (those live in src/modules/<feature>Module.ts).
 *
 * USED BY
 *   src/server.ts, tests/helpers/buildTestApp.ts
 */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import type { Express } from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import type { RedisReply } from 'rate-limit-redis';
import * as swaggerUi from 'swagger-ui-express';
import type { IEnv } from './config/env';
import { swaggerSpec } from './docs/swaggerDefinition';
import type { ILogger } from './domain/interfaces/ILogger';
import { RedisClient } from './infrastructure/cache/RedisClient';
import { createDatabase } from './infrastructure/database/prismaClient';
import type { PinoLogger } from './infrastructure/services/PinoLogger';
import { errorHandlerMiddleware } from './interface/middlewares/errorHandlerMiddleware';
import { notFoundMiddleware } from './interface/middlewares/notFoundMiddleware';
import { createRateLimiter } from './interface/middlewares/rateLimiterMiddleware';
import { requestContextMiddleware } from './interface/middlewares/requestContextMiddleware';
import { sanitizeMiddleware } from './interface/middlewares/sanitizeMiddleware';
import { validate } from './interface/middlewares/validateRequestMiddleware';
import { featureModules } from './modules';
import type { IScheduler, ISharedDependencies } from './modules/types';

export interface IBuildAppInput {
  config: IEnv;
  logger: PinoLogger;
}

export interface IBuildAppResult {
  app: Express;
  shared: ISharedDependencies;
  schedulers: IScheduler[];
}

export async function buildApp({ config, logger }: IBuildAppInput): Promise<IBuildAppResult> {
  // 1. Shared adapters (each ONCE) ------------------------------------------------------------
  const appLogger: ILogger = logger;
  const database = createDatabase({ url: config.database.url });
  const redis = new RedisClient({ url: config.redis.url }, appLogger);
  try {
    await redis.connect();
  } catch (err) {
    redis.raw.disconnect();
    await database.disconnect();
    throw err;
  }

  const sendCommand = (...args: string[]): Promise<RedisReply> =>
    redis.raw.call(args[0] ?? '', ...args.slice(1)) as Promise<RedisReply>;

  const shared: ISharedDependencies = {
    config,
    logger: appLogger,
    database,
    redis,
    http: {
      validate,
      createRateLimiter: (options) => createRateLimiter({ ...options, sendCommand }),
    },
  };

  const modules = featureModules.map((create) => create(shared));
  const schedulers = modules.flatMap((m) => m.schedulers ?? []);

  // 2. Express app + global chain ------------------------------------------------------------
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);

  app.use(requestContextMiddleware());
  app.use(
    pinoHttp({
      logger: logger.pino,
      genReqId: (_req, res) => String(res.getHeader('X-Request-Id')),
    }),
  );

  // 3. Unversioned modules (health) BEFORE the limiter so probes are never throttled ------------
  for (const m of modules.filter((mod) => mod.versioned === false)) {
    app.use(m.basePath || '/', m.router);
  }

  app.use(helmet());
  app.use(cors({ origin: config.cors.origins, credentials: true }));
  app.use(express.json({ limit: config.requestBodyLimit }));
  app.use(cookieParser());
  app.use(sanitizeMiddleware({ skipFields: ['password'] }));
  app.use(createRateLimiter({ prefix: 'rl:global:', windowMs: 60_000, limit: 300, sendCommand }));

  if (config.nodeEnv !== 'production') {
    app.get('/api-docs.json', (_req, res) => {
      res.json(swaggerSpec);
    });
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  for (const m of modules.filter((mod) => mod.versioned !== false)) {
    app.use(`/v1${m.basePath}`, m.router);
  }

  // 4. 404 + error envelope - LAST -------------------------------------------------------------
  app.use(notFoundMiddleware());
  app.use(errorHandlerMiddleware({ logger: appLogger }));

  return { app, shared, schedulers };
}
