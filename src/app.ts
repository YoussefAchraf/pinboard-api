/**
 * FILE:   src/app.ts
 * LAYER:  composition root (may import every layer). Owns the APPLICATION WIRING, not the process.
 * STATUS: stub - compiles on the empty template; replace the body on first implementation.
 *
 * PURPOSE
 *   `buildApp()` is the dependency-injection container: it builds every SHARED adapter once,
 *   applies the global middleware chain, mounts the feature modules, and returns the app.
 *   Tests call it directly (no listening socket) - see tests/helpers/buildTestApp.ts.
 *
 * WHAT TO WRITE (in this order)
 *   export interface IBuildAppInput  { config: IEnv; logger: ILogger }
 *   export interface IBuildAppResult { app: Express; shared: ISharedDependencies;
 *                                      schedulers: Array<{ start(): void; stop(): Promise<void> | void }> }
 *   export async function buildApp({ config, logger }: IBuildAppInput): Promise<IBuildAppResult>
 *
 *   1. Shared adapters (each ONCE):
 *        database   = createDatabase({ url: config.database.url })        infrastructure/database/prismaClient
 *        redis      = new RedisClient({ url: config.redis.url }, logger); await redis.connect()
 *        unitOfWork = new PrismaUnitOfWork(database.prisma)
 *        users      = new PgUserRepository(database.prisma)
 *        security   = { passwordHasher: new PasswordHasher(), tokenService: new TokenService(config.jwt),
 *                       refreshTokenStore: new RefreshTokenStore(redis), csrf: new CsrfTokenService() }
 *        sendCommand = (...args: string[]) => redis.raw.call(args[0], ...args.slice(1))
 *        http       = { authMiddleware: authMiddleware({ verifyAccess: (t) => security.tokenService.verifyAccess(t) }),
 *                       validate, createRateLimiter: (o) => createRateLimiter({ ...o, sendCommand }) }
 *        shared: ISharedDependencies = { config, logger, database, redis, unitOfWork,
 *                                        repositories: { users }, security, http }
 *   2. Express app + global chain (order matters):
 *        app.disable('x-powered-by'); app.set('trust proxy', config.trustProxy)
 *        requestContextMiddleware() -> pinoHttp({ logger: logger.pino }) -> helmet()
 *        -> cors({ origin: config.cors.origins, credentials: true })
 *        -> express.json({ limit: config.requestBodyLimit }) -> cookieParser()
 *        -> sanitizeMiddleware({ skipFields: ['password'] })
 *   3. Mount unversioned modules (health) BEFORE the limiter, then:
 *        global limiter: createRateLimiter({ prefix: 'rl:global:', windowMs: 60_000, limit: 300, sendCommand })
 *        csrfMiddleware({ matches: (c, h) => security.csrf.matches(c, h), exemptPaths: ['/v1/auth/login'] })
 *        swagger: /api-docs.json + /api-docs (skip in production unless enabled)
 *        for (const create of featureModules) { const m = create(shared);
 *          app.use(m.versioned === false ? m.basePath || '/' : `/v1${m.basePath}`, m.router);
 *          schedulers.push(...(m.schedulers ?? [])) }
 *   4. notFoundMiddleware() then errorHandlerMiddleware({ logger, exposeDetails: config.nodeEnv !== 'production' }) - LAST.
 *   5. return { app, shared, schedulers }
 *
 * NEVER PUT HERE
 *   Route handlers, business rules, SQL, cache reads, feature-specific `new UseCase(...)`
 *   (those live in src/modules/<feature>Module.ts).
 *
 * USED BY
 *   src/server.ts                   `const { app, shared, schedulers } = await buildApp({ config, logger })`
 *   tests/helpers/buildTestApp.ts   same call with a test config, then supertest(app)
 */

interface IBuildAppStubResult {
  readonly stub: true;
}

/** Temporary stub so tsc/lint/CI pass on the empty template. Replace per the header above. */
function buildApp(): IBuildAppStubResult {
  return { stub: true };
}

export { buildApp };
