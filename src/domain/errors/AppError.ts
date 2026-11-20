/**
 * FILE:   src/domain/errors/AppError.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The single error type every layer throws for EXPECTED failures. The global error
 *   handler turns it into the cross-stack envelope `{ error, code }`
 *   (contracts/conventions.md -> Error envelope).
 *
 * WHAT TO WRITE
 *   class AppError extends Error {
 *     readonly status: number;          // HTTP status to respond with (4xx for expected errors)
 *     readonly code: ErrorCode;         // machine-readable, from ./errorCodes
 *     readonly details?: unknown;       // optional, safe-to-expose context (e.g. field errors)
 *     constructor(code: ErrorCode, message: string, status: number, details?: unknown)
 *   }
 *   - Set `this.name = 'AppError'` and keep the prototype chain correct
 *     (Object.setPrototypeOf(this, AppError.prototype)) so `instanceof` works after tsc.
 *   - Optional static helpers for the common cases keep call sites short:
 *       AppError.notFound(msg), AppError.unauthorized(msg), AppError.forbidden(msg),
 *       AppError.conflict(msg), AppError.validation(msg, details)
 *   - Do NOT create ad-hoc subclasses per feature; add a code to errorCodes.ts instead.
 *
 * EXPORTS
 *   class AppError
 *
 * USED BY
 *   use-cases/**                                   `throw AppError.unauthorized('Invalid credentials')`
 *   domain/entities/**                             invariant violations
 *   interface/middlewares/errorHandlerMiddleware.ts `if (err instanceof AppError) -> res.status(err.status).json({ error: err.message, code: err.code })`
 *   interface/middlewares/validateRequestMiddleware.ts zod failure -> AppError.validation(...)
 *
 * MAY IMPORT
 *   ./errorCodes only.
 */
export {};
