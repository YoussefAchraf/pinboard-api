/**
 * FILE:   tests/helpers/buildTestApp.ts
 * LAYER:  tests (relaxed lint)
 * STATUS: placeholder - implement when the first e2e/smoke test is written.
 *
 * PURPOSE
 *   Builds the real application (src/app.ts) with a deterministic test config, for supertest.
 *
 * WHAT TO WRITE
 *   export async function buildTestApp(overrides?: Partial<Record<string, string>>): Promise<{
 *     app: Express; shared: ISharedDependencies; close(): Promise<void>;
 *   }>
 *     - config = loadEnv({ ...TEST_ENV, ...overrides })   // TEST_ENV: NODE_ENV=test, CI DATABASE_URL/REDIS_URL, test secrets
 *     - logger = a silent ILogger (level 'silent') so test output stays clean
 *     - { app, shared } = await buildApp({ config, logger })
 *     - close() -> shared.database.disconnect() + shared.redis.close()
 *   Usage in a test:
 *     const t = await buildTestApp(); afterAll(() => t.close());
 *     await request(t.app).post('/v1/auth/login').send({ email, password }).expect(200);
 */
export {};
