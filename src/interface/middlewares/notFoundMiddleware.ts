/**
 * FILE:   src/interface/middlewares/notFoundMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   Catch-all for unmatched routes, so even 404s use the `{ error, code }` envelope.
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
import type { RequestHandler } from 'express';
import { AppError } from '../../domain/errors/AppError';

export function notFoundMiddleware(): RequestHandler {
  return (req, _res, next) => next(AppError.notFound(`Route ${req.method} ${req.path} not found`));
}
