/**
 * FILE:   src/interface/middlewares/requireRoleMiddleware.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Coarse role gate for whole routes. Fine-grained, data-dependent rules ("only the owner
 *   may edit this project") belong in the USE CASE, not here.
 *
 * WHAT TO WRITE
 *   export function requireRole(...allowed: Role[]): RequestHandler {
 *     return (req, _res, next) => {
 *       if (!req.auth) throw AppError(ERROR_CODES.UNAUTHENTICATED, ..., 401);   // authMiddleware missing
 *       if (!allowed.includes(req.auth.role)) throw AppError(ERROR_CODES.FORBIDDEN, ..., 403);
 *       next();
 *     };
 *   }
 *
 * EXPORTS
 *   function requireRole
 *
 * USED BY
 *   interface/routes/*Routes.ts  `router.delete('/:id', deps.authMiddleware, requireRole(ROLES.ADMIN), controller.remove)`
 *
 * MAY IMPORT
 *   express (types), domain/constants/roles, domain/errors/*.
 */
export {};
