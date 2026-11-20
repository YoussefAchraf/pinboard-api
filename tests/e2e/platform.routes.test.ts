import { randomUUID } from 'node:crypto';
import express from 'express';
import request from 'supertest';
import { errorHandlerMiddleware } from '../../src/interface/middlewares/errorHandlerMiddleware';
import { buildTestApp } from '../helpers/buildTestApp';
import type { ITestApp } from '../helpers/buildTestApp';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

describe('e2e: platform (global chain through buildApp)', () => {
  let t: ITestApp;

  beforeAll(async () => {
    t = await buildTestApp();
  });

  afterAll(async () => {
    await t.close();
  });

  it('unknown /v1 route -> 404 { error, code: NOT_FOUND } with a generated X-Request-Id', async () => {
    const res = await request(t.app).get('/v1/does-not-exist').expect(404);
    expect(res.body).toEqual({ error: expect.any(String), code: 'NOT_FOUND' });
    expect(res.headers['x-request-id']).toMatch(UUID_PATTERN);
  });

  it('echoes a valid incoming X-Request-Id', async () => {
    const res = await request(t.app).get('/v1/does-not-exist').set('X-Request-Id', 'client-req_0001').expect(404);
    expect(res.headers['x-request-id']).toBe('client-req_0001');
  });

  it.each(['short', 'has spaces in it', 'x'.repeat(65), 'bad<chars>here'])(
    'replaces an invalid X-Request-Id (%s) with a generated one',
    async (incoming) => {
      const res = await request(t.app).get('/v1/does-not-exist').set('X-Request-Id', incoming).expect(404);
      expect(res.headers['x-request-id']).toMatch(UUID_PATTERN);
    },
  );

  it('sets X-Request-Id on the unversioned probes too', async () => {
    const res = await request(t.app).get('/health').expect(200);
    expect(res.headers['x-request-id']).toMatch(UUID_PATTERN);
  });

  it('malformed JSON body -> 400 VALIDATION_FAILED', async () => {
    const res = await request(t.app)
      .post('/v1/does-not-exist')
      .set('Content-Type', 'application/json')
      .send('{"broken": ')
      .expect(400);
    expect(res.body).toEqual({ error: 'Malformed JSON body', code: 'VALIDATION_FAILED' });
  });

  it('applies helmet headers and the CORS allow-list with credentials', async () => {
    const allowed = await request(t.app).get('/v1/does-not-exist').set('Origin', 'http://localhost:3000');
    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    expect(allowed.headers['access-control-allow-credentials']).toBe('true');
    expect(allowed.headers['x-content-type-options']).toBe('nosniff');
    expect(allowed.headers['x-powered-by']).toBeUndefined();

    const denied = await request(t.app).get('/v1/does-not-exist').set('Origin', 'https://evil.example');
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('global limiter publishes standard RateLimit headers on /v1 but not on /health', async () => {
    const v1 = await request(t.app).get('/v1/does-not-exist');
    expect(v1.headers['ratelimit-policy']).toBeDefined();
    const health = await request(t.app).get('/health');
    expect(health.headers['ratelimit-policy']).toBeUndefined();
  });

  it('shared createRateLimiter (Redis store) -> 429 RATE_LIMITED with Retry-After over the limit', async () => {
    const limited = express();
    limited.use(t.shared.http.createRateLimiter({ prefix: `rl:test:${randomUUID()}:`, windowMs: 60_000, limit: 2 }));
    limited.get('/x', (_req, res) => {
      res.json({ ok: true });
    });
    limited.use(errorHandlerMiddleware({ logger: t.shared.logger }));

    await request(limited).get('/x').expect(200);
    await request(limited).get('/x').expect(200);
    const res = await request(limited).get('/x').expect(429);
    expect(res.body).toEqual({ error: 'Too many requests', code: 'RATE_LIMITED' });
    expect(Number(res.headers['retry-after'])).toBeGreaterThan(0);
  });
});
