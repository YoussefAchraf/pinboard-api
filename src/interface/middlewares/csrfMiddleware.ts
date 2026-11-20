/**
 * FILE:   src/interface/middlewares/csrfMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Double-submit CSRF protection for cookie-authenticated mutations: the `csrfToken`
 *   cookie must equal the `X-CSRF-Token` header on POST/PUT/PATCH/DELETE.
 *
 * WHAT TO WRITE
 *   export function csrfMiddleware(deps: {
 *     matches: (cookie?: string, header?: string) => boolean;
 *     exemptPaths: string[];                        // exact paths, e.g. ['/v1/auth/login']
 *   }): RequestHandler {
 *     return (req, _res, next) => {
 *       if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
 *       if (deps.exemptPaths.includes(req.path)) return next();
 *       if (!deps.matches(req.cookies?.csrfToken, req.header('x-csrf-token')))
 *         throw AppError(ERROR_CODES.CSRF_INVALID, 'Invalid CSRF token', 403);
 *       next();
 *     };
 *   }
 *   - `matches` is CsrfTokenService.matches injected by the composition root (no infra import).
 *   - DECISION: mounted GLOBALLY in app.ts after cookieParser, so no new mutating route can
 *     forget it. Only login is exempt (no session exists yet). Adding an exemption requires a
 *     manager decision recorded in contracts/conventions.md.
 *
 * EXPORTS
 *   function csrfMiddleware
 *
 * USED BY
 *   src/app.ts   `app.use(csrfMiddleware({ matches, exemptPaths: ['/v1/auth/login'] }))`
 *
 * MAY IMPORT
 *   express (types), domain/errors/*.
 */
export {};
