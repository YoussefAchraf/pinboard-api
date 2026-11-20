import express from 'express';
import request from 'supertest';
import { AppError } from '../../src/domain/errors/AppError';
import type { ILogger } from '../../src/domain/interfaces/ILogger';
import { errorHandlerMiddleware } from '../../src/interface/middlewares/errorHandlerMiddleware';
import { notFoundMiddleware } from '../../src/interface/middlewares/notFoundMiddleware';

function makeLogger(): ILogger & { error: jest.Mock } {
  const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    child: jest.fn(),
  };
  logger.child.mockReturnValue(logger);
  return logger;
}

function makeApp(logger: ILogger) {
  const app = express();
  app.use(express.json({ limit: '1kb' }));
  app.get('/app-error', () => {
    throw new AppError('CONFLICT', 'Already exists', 409, { fields: { email: 'validation.taken' } });
  });
  app.get('/app-error-500', () => {
    throw new AppError('INTERNAL_ERROR', 'db password leaked here', 500, { secret: 'x' });
  });
  app.get('/boom', () => {
    throw new Error('connect ECONNREFUSED 10.0.0.1:5432 at Socket.stack');
  });
  app.get('/async-boom', async () => {
    await Promise.resolve();
    throw new TypeError('cannot read property of undefined');
  });
  app.post('/echo', (req, res) => {
    res.json(req.body);
  });
  app.use(notFoundMiddleware());
  app.use(errorHandlerMiddleware({ logger }));
  return app;
}

describe('errorHandlerMiddleware', () => {
  it('maps an AppError to its status and the { error, code, details } envelope', async () => {
    const logger = makeLogger();
    const res = await request(makeApp(logger)).get('/app-error').expect(409);
    expect(res.body).toEqual({
      error: 'Already exists',
      code: 'CONFLICT',
      details: { fields: { email: 'validation.taken' } },
    });
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('answers unknown routes with 404 NOT_FOUND', async () => {
    const res = await request(makeApp(makeLogger())).get('/nope').expect(404);
    expect(res.body.code).toBe('NOT_FOUND');
    expect(typeof res.body.error).toBe('string');
  });

  it.each(['/boom', '/async-boom', '/app-error-500'])(
    'answers %s with a generic 500 INTERNAL_ERROR (no stack, no details) and logs it',
    async (path) => {
      const logger = makeLogger();
      const res = await request(makeApp(logger)).get(path).expect(500);
      expect(res.body).toEqual({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
      expect(res.text).not.toMatch(/ECONNREFUSED|stack|password|undefined/);
      expect(logger.error).toHaveBeenCalledTimes(1);
    },
  );

  it('answers a malformed JSON body with 400 VALIDATION_FAILED and no details', async () => {
    const res = await request(makeApp(makeLogger()))
      .post('/echo')
      .set('Content-Type', 'application/json')
      .send('{"title": ')
      .expect(400);
    expect(res.body).toEqual({ error: 'Malformed JSON body', code: 'VALIDATION_FAILED' });
  });

  it('answers a body over the size limit with 400 VALIDATION_FAILED', async () => {
    const res = await request(makeApp(makeLogger()))
      .post('/echo')
      .send({ title: 'x'.repeat(2048) })
      .expect(400);
    expect(res.body).toEqual({ error: 'Request body too large', code: 'VALIDATION_FAILED' });
  });
});
