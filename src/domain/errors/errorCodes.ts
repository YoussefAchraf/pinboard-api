/**
 * FILE:   src/domain/errors/errorCodes.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   The catalog of every machine-readable error `code` the API can return
 *   (contracts/conventions.md section 2). The frontend mirrors this list
 *   (rt-fe/src/shared/types/errorCodes.ts) and branches on it, so a code is a PUBLIC CONTRACT:
 *   never rename or remove one without a contract amendment (file a request in ../contracts/requests/).
 *   Feature codes are added here as features land, one line each, with the HTTP status in a comment.
 *
 * EXPORTS
 *   const ERROR_CODES, type ErrorCode
 *
 * USED BY
 *   domain/errors/AppError.ts, use-cases/**, interface/middlewares/*, docs/swaggerDefinition.ts
 *
 * MAY IMPORT
 *   Nothing.
 */
export const ERROR_CODES = {
  VALIDATION_FAILED: 'VALIDATION_FAILED', // 422 (400 for malformed JSON)
  UNAUTHENTICATED: 'UNAUTHENTICATED', // 401 (missing/expired/invalid session)
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS', // 401 (login)
  FORBIDDEN: 'FORBIDDEN', // 403 (authenticated, not allowed)
  CSRF_INVALID: 'CSRF_INVALID', // 403
  NOT_FOUND: 'NOT_FOUND', // 404
  CONFLICT: 'CONFLICT', // 409
  RATE_LIMITED: 'RATE_LIMITED', // 429 (Retry-After header set)
  INTERNAL_ERROR: 'INTERNAL_ERROR', // 500 (never with details)
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
