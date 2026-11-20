/**
 * FILE:   src/interface/middlewares/authMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Authenticates the request from the httpOnly `accessToken` cookie and attaches the
 *   identity to `req.auth`. Does NOT authorize (that is requireRoleMiddleware).
 *
 * WHAT TO WRITE
 *   export interface IAuthContext { userId: string; role: Role }
 *   // Augment Express once (here): declare global { namespace Express { interface Request { auth?: IAuthContext } } }
 *   export function authMiddleware(deps: { verifyAccess: ITokenService['verifyAccess'] }): RequestHandler {
 *     return (req, _res, next) => {
 *       const token = req.cookies?.accessToken;
 *       if (!token) throw AppError(ERROR_CODES.UNAUTHENTICATED, 'Authentication required', 401);
 *       const payload = deps.verifyAccess(token);          // throws UNAUTHENTICATED on invalid/expired
 *       req.auth = { userId: payload.sub, role: payload.role };
 *       next();
 *     };
 *   }
 *   - 401 here lets the frontend's single-flight refresh interceptor kick in.
 *
 * EXPORTS
 *   function authMiddleware, interface IAuthContext
 *
 * USED BY
 *   src/modules/authModule.ts builds it once: `authMiddleware({ verifyAccess: tokenService.verifyAccess.bind(tokenService) })`
 *   and exposes it in ISharedDependencies so every feature route can protect endpoints.
 *   interface/routes/*Routes.ts  `router.get('/', deps.authMiddleware, controller.list)`
 *
 * MAY IMPORT
 *   express (types), domain/** (interfaces, errors, constants).
 */
export {};
