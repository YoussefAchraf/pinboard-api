/**
 * FILE:   src/interface/middlewares/notFoundMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Catch-all for unmatched routes, so even 404s use the `{ error, code }` envelope.
 *
 * WHAT TO WRITE
 *   export function notFoundMiddleware(): RequestHandler {
 *     return (req, _res, next) => next(new AppError(ERROR_CODES.NOT_FOUND, `Route ${req.method} ${req.path} not found`, 404));
 *   }
 *
 * EXPORTS
 *   function notFoundMiddleware
 *
 * USED BY
 *   src/app.ts   mounted AFTER every module router, BEFORE errorHandlerMiddleware
 *
 * MAY IMPORT
 *   express (types), domain/errors/*.
 */
export {};
