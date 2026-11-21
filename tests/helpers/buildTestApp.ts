/**
 * FILE:   tests/helpers/buildTestApp.ts
 * LAYER:  tests (relaxed lint)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   Builds the real application (src/app.ts) with a deterministic test config, for supertest.
 *   - Config = TEST_ENV + overrides, through the real loadEnv(). Only DATABASE_URL and REDIS_URL are
 *     taken from the environment (CI service containers, or the local `.env` via dotenv), falling back
 *     to the docker-compose defaults.
 *   - Logger: a real PinoLogger at level 'silent' so test output stays clean.
 *   Usage:
 *     const t = await buildTestApp(); afterAll(() => t.close());
 *     await request(t.app).get('/health').expect(200);
 */
import { config as loadDotenv } from 'dotenv';
import type { Express } from 'express';
import { buildApp } from '../../src/app';
import { loadEnv } from '../../src/config/env';
import { PinoLogger } from '../../src/infrastructure/services/PinoLogger';
import { getRequestId } from '../../src/interface/middlewares/requestContextMiddleware';
import type { ISharedDependencies } from '../../src/modules/types';

loadDotenv({ quiet: true });

export const TEST_ENV: Record<string, string> = {
  NODE_ENV: 'test',
  PORT: '4000',
  LOG_LEVEL: 'silent',
  TRUST_PROXY: 'false',
  REQUEST_BODY_LIMIT: '100kb',
  CORS_ORIGINS: 'http://localhost:3000',
  COOKIE_SECURE: 'false',
  COOKIE_DOMAIN: 'localhost',
  DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://postgres:changeme@localhost:5432/pinboard',
  REDIS_URL: process.env.REDIS_URL ?? 'redis://:changeme@localhost:6379/0',
  JWT_ACCESS_SECRET: 'test-only-access-secret-at-least-32-chars',
  JWT_REFRESH_SECRET: 'test-only-refresh-secret-at-least-32-chars',
  JWT_ACCESS_TTL: '15m',
  JWT_REFRESH_TTL: '7d',
};

export interface ITestApp {
  app: Express;
  shared: ISharedDependencies;
  close(): Promise<void>;
}

export async function buildTestApp(overrides: Partial<Record<string, string>> = {}): Promise<ITestApp> {
  const config = loadEnv({ ...TEST_ENV, ...overrides });
  const logger = new PinoLogger({ level: 'silent' }, getRequestId);
  const { app, shared } = await buildApp({ config, logger });
  return {
    app,
    shared,
    close: async () => {
      await shared.database.disconnect();
      await shared.redis.close();
    },
  };
}
