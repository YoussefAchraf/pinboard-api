/**
 * FILE:   src/interface/middlewares/requestContextMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   Gives every request a correlation id and makes it available anywhere in the async call
 *   chain (logs from use cases, repositories, error handler) without passing it around.
 *   FIRST middleware in the chain. An incoming `X-Request-Id` is accepted only when it matches
 *   8-64 `[A-Za-z0-9_-]` (contracts/conventions.md section 6); otherwise a UUID is generated.
 *   The id is echoed in the `X-Request-Id` response header.
 *
 * EXPORTS
 *   function requestContextMiddleware, function getRequestId
 *
 * USED BY
 *   src/server.ts  `new PinoLogger({...}, getRequestId)`
 *   src/app.ts     `app.use(requestContextMiddleware())` (first), then pino-http
 *
 * MAY IMPORT
 *   express (types), node:async_hooks, node:crypto.
 */
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import type { RequestHandler } from 'express';

const REQUEST_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;

const storage = new AsyncLocalStorage<{ requestId: string }>();

export function getRequestId(): string | undefined {
  return storage.getStore()?.requestId;
}

export function requestContextMiddleware(): RequestHandler {
  return (req, res, next) => {
    const incoming = req.header('x-request-id');
    const requestId = incoming !== undefined && REQUEST_ID_PATTERN.test(incoming) ? incoming : randomUUID();
    res.setHeader('X-Request-Id', requestId);
    storage.run({ requestId }, () => next());
  };
}
