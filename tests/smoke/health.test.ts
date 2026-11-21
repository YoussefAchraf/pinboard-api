import request from 'supertest';
import { buildTestApp } from '../helpers/buildTestApp';
import type { ITestApp } from '../helpers/buildTestApp';

describe('smoke: health probes (real Postgres + Redis)', () => {
  let t: ITestApp;

  beforeAll(async () => {
    t = await buildTestApp();
  });

  afterAll(async () => {
    await t.close();
  });

  it('GET /health -> 200 { status: ok }', async () => {
    const res = await request(t.app).get('/health').expect(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /ready -> 200 with postgres and redis ok', async () => {
    const res = await request(t.app).get('/ready').expect(200);
    expect(res.body).toEqual({ status: 'ready', checks: { postgres: 'ok', redis: 'ok' } });
  });

  it('probes are not under /v1', async () => {
    await request(t.app).get('/v1/health').expect(404);
  });
});
