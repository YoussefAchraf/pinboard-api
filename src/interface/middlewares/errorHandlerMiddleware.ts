/**
 * FILE:   src/interface/middlewares/errorHandlerMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   The ONE place that turns errors into HTTP responses, always with the cross-stack
 *   envelope `{ error, code }` (+ `details` for 4xx AppErrors that carry them). LAST middleware.
 *   - AppError -> its status; 5xx AppErrors are logged and answered with the generic
 *     INTERNAL_ERROR body (no message, no details).
 *   - body-parser errors (they carry a string `type` and a 4xx `status`): malformed JSON, body over
 *     REQUEST_BODY_LIMIT, unsupported charset/encoding -> 400 VALIDATION_FAILED, no details.
 *   - anything else -> 500 INTERNAL_ERROR, generic message, logged with the request id (the logger
 *     adds it). Never a stack trace or internal message in any environment.
 *   - Express 5 needs the 4-argument signature to recognise an error handler.
 *
 * EXPORTS
 *   function errorHandlerMiddleware
 *
 * USED BY
 *   src/app.ts   `app.use(errorHandlerMiddleware({ logger }))` - LAST
 *
 * MAY IMPORT
 *   express (types), domain/errors/*, domain/interfaces/ILogger (type).
 */
import type { ErrorRequestHandler, Response } from 'express';
import { AppError } from '../../domain/errors/AppError';
import { ERROR_CODES } from '../../domain/errors/errorCodes';
import type { ILogger } from '../../domain/interfaces/ILogger';

interface IBodyParserError {
  type: string;
  status: number;
}

function isBodyParserError(err: unknown): err is IBodyParserError {
  if (err === null || typeof err !== 'object') return false;
  const candidate = err as Partial<IBodyParserError>;
  return (
    typeof candidate.type === 'string' &&
    typeof candidate.status === 'number' &&
    candidate.status >= 400 &&
    candidate.status < 500
  );
}

function bodyParserMessage(type: string): string {
  if (type === 'entity.parse.failed') return 'Malformed JSON body';
  if (type === 'entity.too.large') return 'Request body too large';
  return 'Unreadable request body';
}

function sendInternalError(res: Response): void {
  res.status(500).json({ error: 'Internal server error', code: ERROR_CODES.INTERNAL_ERROR });
}

export function errorHandlerMiddleware(deps: { logger: ILogger }): ErrorRequestHandler {
  return (err: unknown, req, res, next) => {
    if (res.headersSent) {
      next(err);
      return;
    }

    if (err instanceof AppError) {
      if (err.status >= 500) {
        deps.logger.error('app_error', { err, code: err.code, method: req.method, path: req.path });
        sendInternalError(res);
        return;
      }
      res.status(err.status).json({
        error: err.message,
        code: err.code,
        ...(err.details !== undefined ? { details: err.details } : {}),
      });
      return;
    }

    if (isBodyParserError(err)) {
      res.status(400).json({ error: bodyParserMessage(err.type), code: ERROR_CODES.VALIDATION_FAILED });
      return;
    }

    deps.logger.error('unhandled_error', { err, method: req.method, path: req.path });
    sendInternalError(res);
  };
}
