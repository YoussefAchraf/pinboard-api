import { Writable } from 'node:stream';
import express from 'express';
import pino from 'pino';
import request from 'supertest';
import { PinoLogger, REDACT_PATHS } from '../../src/infrastructure/services/PinoLogger';
import { sanitizeMiddleware } from '../../src/interface/middlewares/sanitizeMiddleware';

describe('sanitizeMiddleware', () => {
  it('strips HTML from nested body strings and leaves skipped fields untouched', async () => {
    const app = express();
    app.use(express.json());
    app.use(sanitizeMiddleware({ skipFields: ['password'] }));
    app.post('/echo', (req, res) => {
      res.json(req.body);
    });
    const res = await request(app)
      .post('/echo')
      .send({
        title: 'Hi <script>alert(1)</script><b>there</b>',
        tags: ['<img src=x onerror=alert(1)>ok'],
        nested: { note: '<i>n</i>' },
        password: '<p@ss>word',
        count: 3,
      })
      .expect(200);
    expect(res.body).toEqual({ title: 'Hi there', tags: ['ok'], nested: { note: 'n' }, password: '<p@ss>word', count: 3 });
  });
});

describe('PinoLogger', () => {
  function capture() {
    const lines: Array<Record<string, unknown>> = [];
    const stream = new Writable({
      write(chunk: Buffer, _enc, done) {
        lines.push(JSON.parse(chunk.toString()) as Record<string, unknown>);
        done();
      },
    });
    const base = pino({ level: 'debug', redact: { paths: REDACT_PATHS, censor: '[Redacted]' } }, stream);
    return { lines, base };
  }

  it('adds the current request id and redacts cookies, authorization, passwords, tokens and emails', () => {
    const { lines, base } = capture();
    const logger = new PinoLogger({ level: 'debug' }, () => 'req-12345678', base);
    logger.info('user.login', {
      userId: 'u1',
      email: 'someone@example.com',
      password: 'hunter2',
      req: { headers: { cookie: 'accessToken=abc', authorization: 'Bearer abc', host: 'x' } },
      body: { refreshToken: 'r', email: 'a@b.c' },
    });
    expect(lines).toHaveLength(1);
    const line = lines[0] as Record<string, unknown> & { req: { headers: Record<string, string> }; body: Record<string, string> };
    expect(line.requestId).toBe('req-12345678');
    expect(line.msg).toBe('user.login');
    expect(line.userId).toBe('u1');
    expect(line.email).toBe('[Redacted]');
    expect(line.password).toBe('[Redacted]');
    expect(line.req.headers.cookie).toBe('[Redacted]');
    expect(line.req.headers.authorization).toBe('[Redacted]');
    expect(line.req.headers.host).toBe('x');
    expect(line.body).toEqual({ refreshToken: '[Redacted]', email: '[Redacted]' });
  });

  it('child loggers keep the request id and their bindings', () => {
    const { lines, base } = capture();
    new PinoLogger({ level: 'debug' }, () => undefined, base).child({ module: 'health' }).warn('x');
    expect(lines[0]).toMatchObject({ module: 'health', msg: 'x', level: 40 });
    expect(lines[0]).not.toHaveProperty('requestId');
  });
});
