/**
 * FILE:   src/interface/middlewares/requestContextMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Gives every request a correlation id and makes it available anywhere in the async call
 *   chain (logs from use cases, repositories, error handler) without passing it around.
 *   FIRST middleware in the chain.
 *
 * WHAT TO WRITE
 *   const storage = new AsyncLocalStorage<{ requestId: string }>();      // node:async_hooks
 *   export function getRequestId(): string | undefined { return storage.getStore()?.requestId; }
 *   export function requestContextMiddleware(): RequestHandler {
 *     return (req, res, next) => {
 *       const incoming = req.header('x-request-id');
 *       const requestId = incoming && /^[\w-]{8,64}$/.test(incoming) ? incoming : randomUUID();
 *       res.setHeader('X-Request-Id', requestId);
 *       storage.run({ requestId }, () => next());
 *     };
 *   }
 *
 * EXPORTS
 *   function requestContextMiddleware, function getRequestId
 *
 * USED BY
 *   src/server.ts  `new PinoLogger({...}, getRequestId)` - the logger reads the id through this getter
 *   src/app.ts     `app.use(requestContextMiddleware())` (first), then pino-http
 *
 * MAY IMPORT
 *   express (types), node:async_hooks, node:crypto.
 */
export {};
