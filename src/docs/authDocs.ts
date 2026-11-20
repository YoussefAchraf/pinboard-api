/**
 * FILE:   src/docs/authDocs.ts
 * LAYER:  docs (may import docs/ and domain/ only)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   OpenAPI path fragment for the auth feature. One fragment per feature: <feature>Docs.ts.
 *
 * WHAT TO WRITE
 *   export const authPaths = {
 *     '/auth/login':   { post: { tags: ['auth'], requestBody: <LoginRequest>, responses: {
 *                          200: <{ user: User }> + Set-Cookie, 401/422/429: ErrorResponse } } },
 *     '/auth/refresh': { post: { security: [], responses: { 204, 401: ErrorResponse } } },
 *     '/auth/logout':  { post: { responses: { 204 } } },
 *     '/auth/whoami':  { get:  { security: [{ cookieAuth: [] }], responses: { 200: <{ user: User }>, 401 } } },
 *   };
 *   - Copy shapes from ../contracts/openapi/auth.yaml - that file is the source of truth.
 *
 * EXPORTS
 *   const authPaths
 *
 * USED BY
 *   src/docs/swaggerDefinition.ts   `paths: { ...authPaths }`
 *
 * MAY IMPORT
 *   Nothing (plain objects).
 */
export {};
