/**
 * FILE:   src/docs/swaggerDefinition.ts
 * LAYER:  docs (may import docs/ and domain/ only)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The OpenAPI 3 document served at /api-docs (UI) and /api-docs.json, and exported to
 *   docs/openapi.json by `npm run docs:export`. It must stay consistent with the manager's
 *   contracts in ../contracts/openapi/ (CI "openapi drift" job).
 *
 * WHAT TO WRITE
 *   export const swaggerSpec = {
 *     openapi: '3.0.3',
 *     info: { title: 'PinBoard API', version: '1.0.0' },
 *     servers: [{ url: '/v1' }],
 *     components: {
 *       securitySchemes: { cookieAuth: { type: 'apiKey', in: 'cookie', name: 'accessToken' } },
 *       schemas: {
 *         ErrorResponse: { type: 'object', required: ['error', 'code'],
 *                          properties: { error: { type: 'string' },
 *                                        code: { type: 'string', enum: Object.values(ERROR_CODES) },
 *                                        details: {} } },
 *       },
 *     },
 *     paths: { ...authPaths },          // one spread per feature fragment
 *   } as const;
 *
 * EXPORTS
 *   const swaggerSpec
 *
 * USED BY
 *   src/app.ts               `app.get('/api-docs.json', (_req, res) => res.json(swaggerSpec))`,
 *                            `app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))`
 *                            (disable both in production unless explicitly wanted)
 *   scripts/exportSwagger.ts writes it to docs/openapi.json
 *
 * MAY IMPORT
 *   ./<feature>Docs, domain/errors/errorCodes.
 */
export {};
