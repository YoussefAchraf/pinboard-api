/**
 * FILE:   src/domain/interfaces/IReadinessProbe.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Lets the readiness endpoint (/ready) check every critical dependency without knowing
 *   what they are. Each adapter that the app cannot serve without implements it.
 *
 * WHAT TO WRITE
 *   export interface IReadinessProbe {
 *     readonly name: string;            // 'postgres', 'redis', ...
 *     check(): Promise<void>;           // resolves when healthy, rejects otherwise (bounded timeout)
 *   }
 *
 * EXPORTS
 *   interface IReadinessProbe
 *
 * USED BY
 *   infrastructure/database/prismaClient.ts      postgres probe (SELECT 1)
 *   infrastructure/cache/RedisClient.ts          redis probe (PING)
 *   interface/controllers/HealthController.ts    runs all probes for GET /ready
 *   src/modules/healthModule.ts                  passes the probe list in
 *
 * MAY IMPORT
 *   Nothing.
 */
export {};
