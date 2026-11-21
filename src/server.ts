/**
 * FILE:   src/server.ts
 * LAYER:  composition root (may import every layer). Owns the PROCESS, not the application.
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   1. `import 'dotenv/config'` first (local dev; containers inject env directly).
 *   2. `loadEnv()` - invalid env -> readable message on stderr, exit code 1 (fail fast).
 *   3. PinoLogger -> buildApp() -> http.createServer(app).listen(PORT) -> schedulers start.
 *      Optional Realtime module: attach Socket.IO to httpServer before listen.
 *   4. Graceful shutdown on SIGTERM / SIGINT (and after unhandledRejection / uncaughtException):
 *      stop schedulers -> stop accepting + drain (hard timeout 10 s) -> Prisma disconnect -> Redis
 *      close; each step guarded, exit code 1 if any step failed.
 *
 * NEVER PUT HERE
 *   Routes, middleware, business logic, SQL, cache access.
 */
import 'dotenv/config';
import { createServer } from 'node:http';
import type { Server } from 'node:http';
// eslint-disable-next-line boundaries/dependencies -- eslint.config.mjs has no file->file policy for composition-root files (request be-001-decision-lint-composition-root-policy)
import { buildApp } from './app';
import { loadEnv } from './config/env';
import type { IEnv } from './config/env';
import { PinoLogger } from './infrastructure/services/PinoLogger';
import { getRequestId } from './interface/middlewares/requestContextMiddleware';

const SHUTDOWN_TIMEOUT_MS = 10_000;

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      server.closeAllConnections();
      reject(new Error('http server close timeout'));
    }, SHUTDOWN_TIMEOUT_MS);
    server.close((err) => {
      clearTimeout(timer);
      if (err) reject(err);
      else resolve();
    });
    server.closeIdleConnections();
  });
}

async function main(): Promise<void> {
  let config: IEnv;
  try {
    config = loadEnv();
  } catch (err) {
    process.stderr.write(`${err instanceof Error ? err.message : 'Invalid environment configuration'}\n`);
    process.exit(1);
  }

  const logger = new PinoLogger({ level: config.logLevel }, getRequestId);
  const { app, shared, schedulers } = await buildApp({ config, logger });
  const httpServer = createServer(app);

  let stopping = false;
  const shutdown = async (reason: string): Promise<void> => {
    if (stopping) return;
    stopping = true;
    logger.info('server.stopping', { reason });
    const steps: Array<[string, () => Promise<void> | void]> = [
      ['schedulers', async () => {
        await Promise.all(schedulers.map((s) => s.stop()));
      }],
      ['http', () => closeServer(httpServer)],
      ['database', () => shared.database.disconnect()],
      ['redis', () => shared.redis.close()],
    ];
    for (const [name, step] of steps) {
      try {
        await step();
      } catch (err) {
        process.exitCode = 1;
        logger.error('server.shutdown_step_failed', { step: name, err });
      }
    }
    logger.info('server.stopped');
    process.exit();
  };

  process.once('SIGTERM', () => void shutdown('SIGTERM'));
  process.once('SIGINT', () => void shutdown('SIGINT'));
  process.on('unhandledRejection', (err) => {
    logger.error('process.unhandled_rejection', { err });
    process.exitCode = 1;
    void shutdown('unhandledRejection');
  });
  process.on('uncaughtException', (err) => {
    logger.error('process.uncaught_exception', { err });
    process.exitCode = 1;
    void shutdown('uncaughtException');
  });

  httpServer.listen(config.port, () => {
    logger.info('server.started', { port: config.port });
    schedulers.forEach((s) => s.start());
  });
}

main().catch((err: unknown) => {
  process.stderr.write(`Fatal startup error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
