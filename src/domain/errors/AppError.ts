/**
 * FILE:   src/domain/errors/AppError.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   The single error type every layer throws for EXPECTED failures. The global error
 *   handler turns it into the cross-stack envelope `{ error, code, details? }`
 *   (contracts/conventions.md section 2).
 *   Do NOT create ad-hoc subclasses per feature; add a code to errorCodes.ts instead.
 *
 * EXPORTS
 *   class AppError (constructor(code, message, status, details?) + static helpers)
 *
 * USED BY
 *   use-cases/**, domain/entities/**, interface/middlewares/{errorHandler,validateRequest,
 *   notFound,rateLimiter}Middleware.ts
 *
 * MAY IMPORT
 *   ./errorCodes only.
 */
import { ERROR_CODES } from './errorCodes';
import type { ErrorCode } from './errorCodes';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: ErrorCode, message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static validation(message: string, details?: unknown, status = 422): AppError {
    return new AppError(ERROR_CODES.VALIDATION_FAILED, message, status, details);
  }

  static unauthorized(message = 'Authentication required'): AppError {
    return new AppError(ERROR_CODES.UNAUTHENTICATED, message, 401);
  }

  static forbidden(message = 'Forbidden'): AppError {
    return new AppError(ERROR_CODES.FORBIDDEN, message, 403);
  }

  static notFound(message = 'Not found'): AppError {
    return new AppError(ERROR_CODES.NOT_FOUND, message, 404);
  }

  static conflict(message = 'Conflict'): AppError {
    return new AppError(ERROR_CODES.CONFLICT, message, 409);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(ERROR_CODES.INTERNAL_ERROR, message, 500);
  }
}
