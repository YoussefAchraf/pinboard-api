import express from 'express';
import request from 'supertest';
import type { IReadinessProbe } from '../../src/domain/interfaces/IReadinessProbe';
import { HealthController } from '../../src/interface/controllers/HealthController';
import { healthRoutes } from '../../src/interface/routes/healthRoutes';

function probe(name: string, behaviour: 'ok' | 'fail' | 'hang'): IReadinessProbe & { check: jest.Mock } {
  const check = jest.fn(() => {
    if (behaviour === 'ok') return Promise.resolve();
    if (behaviour === 'fail') return Promise.reject(new Error('connect ECONNREFUSED postgresql://user:pw@db'));
    return new Promise<void>(() => undefined);
  });
  return { name, check };
}

function makeApp(probes: IReadinessProbe[], timeoutMs = 50) {
  const app = express();
  app.use(healthRoutes({ healthController: new HealthController({ probes, timeoutMs }) }));
  return app;
}

describe('HealthController', () => {
  it('GET /health answers 200 { status: ok } without running any probe (no I/O)', async () => {
    const postgres = probe('postgres', 'ok');
    const redis = probe('redis', 'fail');
    const res = await request(makeApp([postgres, redis])).get('/health').expect(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(postgres.check).not.toHaveBeenCalled();
    expect(redis.check).not.toHaveBeenCalled();
  });

  it('GET /ready answers 200 when every probe is ok', async () => {
    const res = await request(makeApp([probe('postgres', 'ok'), probe('redis', 'ok')])).get('/ready').expect(200);
    expect(res.body).toEqual({ status: 'ready', checks: { postgres: 'ok', redis: 'ok' } });
  });

  it('GET /ready answers 503 not_ready when a probe fails, without leaking the error', async () => {
    const res = await request(makeApp([probe('postgres', 'fail'), probe('redis', 'ok')])).get('/ready').expect(503);
    expect(res.body).toEqual({ status: 'not_ready', checks: { postgres: 'fail', redis: 'ok' } });
    expect(res.text).not.toMatch(/ECONNREFUSED|postgresql:/);
  });

  it('GET /ready treats a probe that exceeds the timeout as failed', async () => {
    const res = await request(makeApp([probe('postgres', 'ok'), probe('redis', 'hang')], 20)).get('/ready').expect(503);
    expect(res.body.checks).toEqual({ postgres: 'ok', redis: 'fail' });
  });
});
