/**
 * FILE:   src/server.ts
 * LAYER:  composition root (may import every layer). Owns the PROCESS, not the application.
 * STATUS: stub - serves GET /health with node:http so tsc, CI and the Docker HEALTHCHECK
 *         work on the empty template. Replace the body on first implementation.
 *
 * WHAT TO WRITE (in this order)
 *   1. `import 'dotenv/config';` as the FIRST import (local dev; containers inject env directly).
 *   2. `const config = loadEnv();`                      src/config/env.ts - throws -> process exits non-zero
 *   3. `const logger = new PinoLogger({ level: config.logLevel, pretty: config.nodeEnv === 'development' }, getRequestId);`
 *   4. `const { app, shared, schedulers } = await buildApp({ config, logger });`   src/app.ts
 *   5. `const httpServer = http.createServer(app);`
 *      Optional Realtime module: attach Socket.IO to httpServer HERE, before listen
 *      (see src/infrastructure/realtime/.gitkeep).
 *   6. `httpServer.listen(config.port, () => logger.info('server.started', { port: config.port }))`
 *      then `schedulers.forEach((s) => s.start())`.
 *   7. Graceful shutdown - `const shutdown = async (signal) => { ... }`:
 *        logger.info('server.stopping', { signal })
 *        stop schedulers -> httpServer.close() (await in-flight requests, with a hard timeout
 *        e.g. 10 s) -> shared.database.disconnect() -> shared.redis.close()
 *        each step in try/catch (set process.exitCode = 1 on failure), then process.exit().
 *      process.once('SIGTERM', ...) and process.once('SIGINT', ...).
 *   8. process.on('unhandledRejection' | 'uncaughtException') -> logger.error + shutdown.
 *
 * NEVER PUT HERE
 *   Routes, middleware, business logic, SQL, cache access.
 */

import { createServer } from 'node:http';

const port = Number(process.env.PORT ?? 4000);

const server = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found', code: 'NOT_FOUND' }));
});

server.listen(port, () => {
  // eslint-disable-next-line no-console -- temporary stub; the real composition root logs through ILogger
  console.log(`pinboard-api stub listening on port ${port}`);
});

const shutdown = (signal: string): void => {
  // eslint-disable-next-line no-console -- temporary stub
  console.log(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
};

process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));
