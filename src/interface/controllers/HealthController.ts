/**
 * FILE:   src/interface/controllers/HealthController.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   Liveness and readiness endpoints for Docker / orchestrators (unversioned, not in contracts/openapi).
 *   GET /health -> 200 { status: 'ok' }  - no I/O, ever.
 *   GET /ready  -> every probe in parallel, each bounded by `timeoutMs` (default 2000):
 *     all ok  -> 200 { status: 'ready',     checks: { postgres: 'ok', redis: 'ok' } }
 *     any bad -> 503 { status: 'not_ready', checks: { postgres: 'ok', redis: 'fail' } }
 *   The body never contains error messages or connection strings.
 *
 * EXPORTS
 *   class HealthController
 *
 * USED BY
 *   src/modules/healthModule.ts, interface/routes/healthRoutes.ts,
 *   Dockerfile HEALTHCHECK -> /health ; orchestrator readiness probe -> /ready
 *
 * MAY IMPORT
 *   express (types), domain/interfaces/IReadinessProbe (type).
 */
import type { Request, Response } from 'express';
import type { IReadinessProbe } from '../../domain/interfaces/IReadinessProbe';

type TCheckResult = 'ok' | 'fail';

const DEFAULT_TIMEOUT_MS = 2000;

async function runProbe(probe: IReadinessProbe, timeoutMs: number): Promise<TCheckResult> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error('probe timeout')), timeoutMs);
  });
  try {
    await Promise.race([probe.check(), timeout]);
    return 'ok';
  } catch {
    return 'fail';
  } finally {
    clearTimeout(timer);
  }
}

export class HealthController {
  constructor(private readonly _deps: { probes: IReadinessProbe[]; timeoutMs?: number }) {}

  live = (_req: Request, res: Response): void => {
    res.status(200).json({ status: 'ok' });
  };

  ready = async (_req: Request, res: Response): Promise<void> => {
    const timeoutMs = this._deps.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const results = await Promise.all(this._deps.probes.map((probe) => runProbe(probe, timeoutMs)));
    const checks: Record<string, TCheckResult> = {};
    this._deps.probes.forEach((probe, index) => {
      checks[probe.name] = results[index] ?? 'fail';
    });
    const allOk = results.every((result) => result === 'ok');
    res.status(allOk ? 200 : 503).json({ status: allOk ? 'ready' : 'not_ready', checks });
  };
}
