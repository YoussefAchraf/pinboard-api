/**
 * FILE:   src/interface/middlewares/errorHandlerMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The ONE place that turns errors into HTTP responses, always with the cross-stack
 *   envelope `{ error, code }` (+ `details` for validation). LAST middleware in the chain.
 *
 * WHAT TO WRITE
 *   export function errorHandlerMiddleware(deps: { logger: ILogger; exposeDetails: boolean }): ErrorRequestHandler {
 *     return (err, req, res, _next) => {
 *       if (err instanceof AppError) {
 *         if (err.status >= 500) deps.logger.error('app_error', { err, code: err.code });
 *         return res.status(err.status).json({ error: err.message, code: err.code,
 *                                              ...(err.details ? { details: err.details } : {}) });
 *       }
 *       // body-parser errors (malformed JSON / too large): map to 400 VALIDATION_FAILED / 413
 *       deps.logger.error('unhandled_error', { err, path: req.path });
 *       return res.status(500).json({ error: 'Internal server error', code: ERROR_CODES.INTERNAL_ERROR });
 *     };
 *   }
 *   - 5xx responses NEVER contain stack traces or internal messages (any environment).
 *   - requestId is added to logs automatically by the logger; it is also in the X-Request-Id header.
 *   - Express 5 needs the 4-argument signature to recognise an error handler.
 *
 * EXPORTS
 *   function errorHandlerMiddleware
 *
 * USED BY
 *   src/app.ts   `app.use(errorHandlerMiddleware({ logger, exposeDetails: config.nodeEnv !== 'production' }))` - LAST
 *   tests/e2e/** asserts envelopes through it
 *
 * MAY IMPORT
 *   express (types), domain/errors/*, domain/interfaces/ILogger (type).
 */
export {};
