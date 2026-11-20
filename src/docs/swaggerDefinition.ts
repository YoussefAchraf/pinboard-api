/**
 * FILE:   src/docs/swaggerDefinition.ts
 * LAYER:  docs (may import docs/ and domain/ only)
 * STATUS: implemented (task 001) - no paths yet; feature fragments (<feature>Docs.ts) are spread
 *         into `paths` as features land (task 003: authPaths).
 *
 * PURPOSE
 *   The OpenAPI 3 document served at /api-docs (UI) and /api-docs.json outside production, and
 *   exported to docs/openapi.json by `npm run docs:export`. It must stay consistent with the
 *   manager's contracts in ../contracts/openapi/ (CI "openapi drift" job).
 *   /health and /ready are unversioned and intentionally not documented here.
 *
 * EXPORTS
 *   const swaggerSpec
 *
 * USED BY
 *   src/app.ts, scripts/exportSwagger.ts
 *
 * MAY IMPORT
 *   ./<feature>Docs, domain/errors/errorCodes.
 */
import { ERROR_CODES } from '../domain/errors/errorCodes';

export const swaggerSpec = {
  openapi: '3.0.3',
  info: { title: 'PinBoard API', version: '1.0.0' },
  servers: [{ url: '/v1' }],
  components: {
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'accessToken' },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        required: ['error', 'code'],
        properties: {
          error: { type: 'string' },
          code: { type: 'string', enum: Object.values(ERROR_CODES) },
          details: { type: 'object' },
        },
      },
    },
  },
  paths: {},
} as const;
