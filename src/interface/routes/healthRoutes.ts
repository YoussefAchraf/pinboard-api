/**
 * FILE:   src/interface/routes/healthRoutes.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   GET /health (liveness) and GET /ready (readiness). Mounted at the ROOT (not under /v1)
 *   and BEFORE rate limiting, so probes are never throttled.
 *
 * WHAT TO WRITE
 *   export function healthRoutes(deps: { healthController: HealthController }): Router {
 *     const router = Router();
 *     router.get('/health', deps.healthController.live);
 *     router.get('/ready', deps.healthController.ready);
 *     return router;
 *   }
 *
 * EXPORTS
 *   function healthRoutes
 *
 * USED BY
 *   src/modules/healthModule.ts -> `{ basePath: '', versioned: false, router: healthRoutes({...}) }`
 *   tests/smoke/health.test.ts
 *
 * MAY IMPORT
 *   express, ../controllers/HealthController (type).
 */
export {};
