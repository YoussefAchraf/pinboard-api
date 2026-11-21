/**
 * FILE:   src/interface/routes/healthRoutes.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   GET /health (liveness) and GET /ready (readiness). Mounted at the ROOT (not under /v1)
 *   and BEFORE rate limiting, so probes are never throttled.
 *
 * EXPORTS
 *   function healthRoutes
 *
 * USED BY
 *   src/modules/healthModule.ts, tests/smoke/health.test.ts
 *
 * MAY IMPORT
 *   express, ../controllers/HealthController (type).
 */
import { Router } from 'express';
import type { HealthController } from '../controllers/HealthController';

export function healthRoutes(deps: { healthController: HealthController }): Router {
  const router = Router();
  router.get('/health', deps.healthController.live);
  router.get('/ready', deps.healthController.ready);
  return router;
}
