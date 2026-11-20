/**
 * FILE:   src/interface/routes/authRoutes.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Route table for the auth feature. Pure wiring: path + middleware chain + controller method.
 *   Paths are relative to the module basePath ('/auth'), mounted under '/v1' by app.ts.
 *
 * WHAT TO WRITE
 *   export interface IAuthRoutesDependencies {
 *     authController: AuthController;
 *     authMiddleware: RequestHandler;
 *     loginLimiter: RequestHandler;
 *     validate: (schemas: IRequestSchemas) => RequestHandler;
 *   }
 *   export function authRoutes(deps: IAuthRoutesDependencies): Router {
 *     const router = Router();
 *     router.post('/login',   deps.loginLimiter, deps.validate({ body: loginSchema }), deps.authController.login);
 *     router.post('/refresh', deps.authController.refresh);
 *     router.post('/logout',  deps.authController.logout);
 *     router.get('/whoami',   deps.authMiddleware, deps.authController.show);
 *     return router;
 *   }
 *   - Function name MUST end with "Routes" (lint). Kebab-case paths. No handler logic inline.
 *   - CSRF is enforced GLOBALLY in app.ts (login is the only exempt path), so routes never
 *     add it themselves. Login is strictly rate-limited instead.
 *
 * EXPORTS
 *   function authRoutes, interface IAuthRoutesDependencies
 *
 * USED BY
 *   src/modules/authModule.ts -> `{ basePath: '/auth', router: authRoutes({...}) }`
 *   tests/e2e/auth.routes.test.ts (through buildTestApp)
 *
 * MAY IMPORT
 *   express, ../controllers/AuthController (type), ../validation/authSchemas,
 *   ../middlewares/validateRequestMiddleware (type IRequestSchemas).
 */
export {};
