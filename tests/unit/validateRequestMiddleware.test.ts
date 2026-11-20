import express from 'express';
import request from 'supertest';
import { z } from 'zod';
import type { ILogger } from '../../src/domain/interfaces/ILogger';
import { errorHandlerMiddleware } from '../../src/interface/middlewares/errorHandlerMiddleware';
import { validate } from '../../src/interface/middlewares/validateRequestMiddleware';

const silentLogger: ILogger = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
  child: () => silentLogger,
};

function makeApp() {
  const app = express();
  app.use(express.json());
  app.post(
    '/things/:thingId',
    validate({
      params: z.object({ thingId: z.uuid() }),
      query: z.object({ limit: z.coerce.number().int().max(100).default(20) }),
      body: z.object({ email: z.email(), title: z.string().min(1).max(5) }),
    }),
    (req, res) => {
      res.json({ body: req.body, validated: res.locals['validated'] });
    },
  );
  app.use(errorHandlerMiddleware({ logger: silentLogger }));
  return app;
}

const ID = '7f1c2a9e-4b7d-4c1e-9a43-2d5b8e6f0a11';

describe('validate()', () => {
  it('passes parsed input on: body replaced (unknown keys stripped), params/query in res.locals', async () => {
    const res = await request(makeApp())
      .post(`/things/${ID}?limit=5`)
      .send({ email: 'a@example.com', title: 'abc', extra: true })
      .expect(200);
    expect(res.body).toEqual({
      body: { email: 'a@example.com', title: 'abc' },
      validated: { params: { thingId: ID }, query: { limit: 5 } },
    });
  });

  it('answers 422 VALIDATION_FAILED with details.fields mapped to i18n keys', async () => {
    const res = await request(makeApp())
      .post('/things/not-a-uuid?limit=500')
      .send({ email: 'nope', title: 'too long title' })
      .expect(422);
    expect(res.body).toEqual({
      error: 'Invalid request',
      code: 'VALIDATION_FAILED',
      details: {
        fields: {
          thingId: 'validation.invalid_format',
          limit: 'validation.too_big',
          email: 'validation.email',
          title: 'validation.too_big',
        },
      },
    });
  });

  it('reports missing fields as validation.required', async () => {
    const res = await request(makeApp()).post(`/things/${ID}`).send({ title: '' }).expect(422);
    expect(res.body.details.fields).toEqual({ email: 'validation.required', title: 'validation.too_small' });
  });
});
