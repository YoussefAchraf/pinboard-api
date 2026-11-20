/**
 * FILE:   src/infrastructure/security/CsrfTokenService.ts
 * LAYER:  infrastructure (adapters; no express / socket.io, no process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Generates CSRF tokens for the double-submit cookie pattern
 *   (contracts/conventions.md -> Auth contract: readable `csrfToken` cookie, echoed by the
 *   frontend in the `X-CSRF-Token` header on mutating requests).
 *
 * WHAT TO WRITE
 *   export class CsrfTokenService {
 *     generate(): string              // crypto.randomBytes(32).toString('base64url')
 *     matches(cookieValue: string | undefined, headerValue: string | undefined): boolean
 *                                     // both present AND crypto.timingSafeEqual on equal-length buffers
 *   }
 *
 * EXPORTS
 *   class CsrfTokenService
 *
 * USED BY
 *   src/app.ts                               `new CsrfTokenService()` (shared instance)
 *   interface/middlewares/csrfMiddleware.ts  receives a `matches` function (injected, not imported)
 *   interface/controllers/AuthController.ts  receives a `generate` function to set the cookie on login/refresh
 *
 * MAY IMPORT
 *   node:crypto.
 */
export {};
