/**
 * FILE:   src/domain/interfaces/IReadinessProbe.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   Lets the readiness endpoint (/ready) check every critical dependency without knowing
 *   what they are. Each adapter that the app cannot serve without implements it.
 *   `check()` resolves when healthy and rejects otherwise; the caller (HealthController)
 *   bounds it with a timeout.
 *
 * EXPORTS
 *   interface IReadinessProbe
 *
 * USED BY
 *   infrastructure/database/prismaClient.ts (postgres, SELECT 1), infrastructure/cache/RedisClient.ts
 *   (redis, PING), interface/controllers/HealthController.ts, src/modules/healthModule.ts
 *
 * MAY IMPORT
 *   Nothing.
 */
export interface IReadinessProbe {
  readonly name: string;
  check(): Promise<void>;
}
