/**
 * FILE:   src/modules/healthModule.ts
 * LAYER:  composition root (may import every layer)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   Wires /health (liveness) and /ready (readiness) with every critical dependency's probe
 *   (postgres, redis). Unversioned: mounted at the root by app.ts, before the global limiter.
 *   When an optional module adds a critical dependency, add its probe here.
 *
 * EXPORTS
 *   const createHealthModule
 *
 * USED BY
 *   src/app.ts (mounted before the global rate limiter)
 *
 * MAY IMPORT
 *   ./types, interface/controllers/HealthController, interface/routes/healthRoutes.
 */
import type { FeatureModuleFactory } from './types';
import { HealthController } from '../interface/controllers/HealthController';
import { healthRoutes } from '../interface/routes/healthRoutes';

export const createHealthModule: FeatureModuleFactory = (deps) => ({
  name: 'health',
  basePath: '',
  versioned: false,
  router: healthRoutes({
    healthController: new HealthController({ probes: [deps.database.probe, deps.redis.probe] }),
  }),
});
