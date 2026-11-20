/**
 * FILE:   src/modules/healthModule.ts
 * LAYER:  composition root (may import every layer)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Wires /health (liveness) and /ready (readiness) with every critical dependency's probe.
 *
 * WHAT TO WRITE
 *   export const createHealthModule: FeatureModuleFactory = (deps) => ({
 *     name: 'health',
 *     basePath: '',
 *     versioned: false,          // mounted at the root, not under /v1
 *     router: healthRoutes({
 *       healthController: new HealthController({ probes: [deps.database.probe, deps.redis.probe] }),
 *     }),
 *   });
 *   - When an optional module adds a critical dependency (e.g. an SMTP relay the app cannot
 *     work without), add its probe here.
 *
 * EXPORTS
 *   const createHealthModule
 *
 * USED BY
 *   src/modules/index.ts (FIRST in the list, mounted before rate limiting by app.ts)
 *
 * MAY IMPORT
 *   ./types, interface/controllers/HealthController, interface/routes/healthRoutes.
 */
export {};
