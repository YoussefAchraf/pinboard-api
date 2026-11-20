/**
 * FILE:   src/modules/types.ts
 * LAYER:  composition root (may import every layer; lives with app.ts / server.ts)
 * STATUS: implemented (task 001) - task 003 extends ISharedDependencies with unitOfWork,
 *         repositories, security and http.authMiddleware.
 *
 * PURPOSE
 *   The two contracts of the FEATURE MODULE pattern:
 *     - ISharedDependencies: everything app.ts builds ONCE and hands to every module
 *     - IFeatureModule:      what a module returns so app.ts can mount it
 *   Adding a feature = one new module file + one line in src/modules/index.ts.
 *   `basePath` is prefixed with '/v1' by app.ts unless `versioned === false` (health only).
 *
 * EXPORTS
 *   interface ISharedDependencies, interface IFeatureModule, interface IScheduler,
 *   type FeatureModuleFactory
 *
 * USED BY
 *   src/modules/*Module.ts, src/modules/index.ts, src/app.ts
 *
 * MAY IMPORT
 *   Every layer (types only here).
 */
import type { RequestHandler, Router } from 'express';
import type { IEnv } from '../config/env';
import type { ILogger } from '../domain/interfaces/ILogger';
import type { RedisClient } from '../infrastructure/cache/RedisClient';
import type { IDatabase } from '../infrastructure/database/prismaClient';
import type { IRateLimiterOptions } from '../interface/middlewares/rateLimiterMiddleware';
import type { IRequestSchemas } from '../interface/middlewares/validateRequestMiddleware';

export interface ISharedDependencies {
  config: IEnv;
  logger: ILogger;
  database: IDatabase;
  redis: RedisClient;
  http: {
    validate: (schemas: IRequestSchemas) => RequestHandler;
    createRateLimiter: (options: Omit<IRateLimiterOptions, 'sendCommand'>) => RequestHandler;
  };
}

export interface IScheduler {
  start(): void;
  stop(): Promise<void> | void;
}

export interface IFeatureModule {
  name: string;
  basePath: string;
  versioned?: boolean;
  router: Router;
  schedulers?: IScheduler[];
}

export type FeatureModuleFactory = (deps: ISharedDependencies) => IFeatureModule;
