/**
 * FILE:   src/modules/types.ts
 * LAYER:  composition root (may import every layer; lives with app.ts / server.ts)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The two contracts of the FEATURE MODULE pattern:
 *     - ISharedDependencies: everything app.ts builds ONCE and hands to every module
 *     - IFeatureModule:      what a module returns so app.ts can mount it
 *   This keeps app.ts short and stable: adding a feature = one new module file + one line
 *   in src/modules/index.ts (no merge conflicts between parallel agents in app.ts).
 *
 * WHAT TO WRITE
 *   export interface ISharedDependencies {
 *     config: IEnv;
 *     logger: ILogger;
 *     database: IDatabase;                     // prisma + probe
 *     redis: RedisClient;
 *     unitOfWork: IUnitOfWork;
 *     repositories: { users: IUserRepository };   // shared repository instances
 *     security: { passwordHasher: IPasswordHasher; tokenService: ITokenService;
 *                 refreshTokenStore: IRefreshTokenStore; csrf: CsrfTokenService };
 *     http: { authMiddleware: RequestHandler;
 *             validate: (schemas: IRequestSchemas) => RequestHandler;
 *             createRateLimiter: (o: Omit<IRateLimiterOptions, 'sendCommand'>) => RequestHandler };
 *   }
 *   export interface IFeatureModule {
 *     name: string;                 // 'auth'
 *     basePath: string;             // '/auth'  (app.ts prefixes '/v1' unless versioned === false)
 *     versioned?: boolean;          // false only for /health and /ready
 *     router: Router;
 *     schedulers?: Array<{ start(): void; stop(): Promise<void> | void }>;
 *   }
 *   export type FeatureModuleFactory = (deps: ISharedDependencies) => IFeatureModule;
 *
 * EXPORTS
 *   interface ISharedDependencies, interface IFeatureModule, type FeatureModuleFactory
 *
 * USED BY
 *   src/modules/*Module.ts   implement FeatureModuleFactory
 *   src/modules/index.ts     typed module list
 *   src/app.ts               builds ISharedDependencies, mounts IFeatureModule[]
 *
 * MAY IMPORT
 *   Every layer (types only here).
 */
export {};
