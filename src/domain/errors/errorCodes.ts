/**
 * FILE:   src/domain/errors/errorCodes.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The catalog of every machine-readable error `code` the API can return. The frontend
 *   mirrors this list (rt-fe/src/shared/types/errorCodes.ts) and branches on it, so a code
 *   is a PUBLIC CONTRACT: never rename or remove one without a contract amendment
 *   (file a request in ../contracts/requests/).
 *
 * WHAT TO WRITE
 *   export const ERROR_CODES = {
 *     VALIDATION_FAILED: 'VALIDATION_FAILED',       // 422
 *     UNAUTHENTICATED: 'UNAUTHENTICATED',           // 401 (missing/expired access token)
 *     INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',   // 401 (login)
 *     FORBIDDEN: 'FORBIDDEN',                       // 403 (authenticated, not allowed)
 *     CSRF_INVALID: 'CSRF_INVALID',                 // 403
 *     NOT_FOUND: 'NOT_FOUND',                       // 404
 *     CONFLICT: 'CONFLICT',                         // 409
 *     RATE_LIMITED: 'RATE_LIMITED',                 // 429
 *     INTERNAL_ERROR: 'INTERNAL_ERROR',             // 500 (never with details)
 *   } as const;
 *   export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
 *   - Add feature codes here as features land (e.g. PROJECT_ARCHIVED), one line each,
 *     with the HTTP status in a trailing comment.
 *
 * EXPORTS
 *   const ERROR_CODES, type ErrorCode
 *
 * USED BY
 *   domain/errors/AppError.ts                       (code field type)
 *   use-cases/**                                    AppError.unauthorized -> ERROR_CODES.INVALID_CREDENTIALS
 *   interface/middlewares/errorHandlerMiddleware.ts (INTERNAL_ERROR, VALIDATION_FAILED)
 *   interface/middlewares/rateLimiterMiddleware.ts  (RATE_LIMITED)
 *   interface/middlewares/csrfMiddleware.ts         (CSRF_INVALID)
 *   docs/swaggerDefinition.ts                       (ErrorResponse schema enum)
 *
 * MAY IMPORT
 *   Nothing.
 */
export {};
