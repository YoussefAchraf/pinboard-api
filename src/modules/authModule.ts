/**
 * FILE:   src/modules/authModule.ts
 * LAYER:  composition root (may import every layer; the only place besides app.ts that `new`s classes)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Wires the auth feature: use cases -> controller -> routes. Receives shared adapters,
 *   creates only what is specific to auth.
 *
 * WHAT TO WRITE
 *   export const createAuthModule: FeatureModuleFactory = (deps) => {
 *     const { users } = deps.repositories;
 *     const { passwordHasher, tokenService, refreshTokenStore, csrf } = deps.security;
 *     const hashToken = (t: string): string => createHash('sha256').update(t).digest('hex');
 *
 *     const loginUseCase = new LoginUseCase({ userRepository: users, passwordHasher, tokenService,
 *                                             refreshTokenStore, idGenerator: randomUUID, hashToken });
 *     const refreshSessionUseCase = new RefreshSessionUseCase({ userRepository: users, tokenService, refreshTokenStore, hashToken });
 *     const logoutUseCase = new LogoutUseCase({ tokenService, refreshTokenStore });
 *     const getCurrentUserUseCase = new GetCurrentUserUseCase({ userRepository: users });
 *
 *     const authController = new AuthController({
 *       loginUseCase, refreshSessionUseCase, logoutUseCase, getCurrentUserUseCase,
 *       cookieOptions: { secure: deps.config.cookies.secure, domain: deps.config.cookies.domain, ... },
 *       generateCsrfToken: () => csrf.generate(),
 *     });
 *
 *     return {
 *       name: 'auth',
 *       basePath: '/auth',
 *       router: authRoutes({
 *         authController,
 *         authMiddleware: deps.http.authMiddleware,
 *         validate: deps.http.validate,
 *         loginLimiter: deps.http.createRateLimiter({ prefix: 'rl:login:', windowMs: 15 * 60_000, limit: 10 }),
 *       }),
 *     };
 *   };
 *
 * TEMPLATE FOR NEW FEATURES
 *   Copy this file to src/modules/<feature>Module.ts, then add it to src/modules/index.ts.
 *   Feature-specific repositories are created HERE (new Pg<Thing>Repository(deps.database.prisma))
 *   unless another module also needs them - then add them to ISharedDependencies.repositories.
 *
 * EXPORTS
 *   const createAuthModule
 *
 * USED BY
 *   src/modules/index.ts   `export const featureModules = [createHealthModule, createAuthModule, ...]`
 *
 * MAY IMPORT
 *   ./types, use-cases/auth/*, interface/controllers/AuthController, interface/routes/authRoutes, node:crypto.
 */
export {};
