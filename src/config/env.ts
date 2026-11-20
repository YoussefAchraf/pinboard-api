/**
 * FILE:   src/config/env.ts
 * LAYER:  config (parsing only - no business logic, no I/O besides reading process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The ONLY place that reads process.env. Validates every variable once at boot and
 *   returns a typed, frozen config object. An invalid env must crash the process at
 *   startup with a readable message (fail fast) - never at the first request.
 *
 * WHAT TO WRITE
 *   - A zod schema covering every variable in .env.example:
 *       PORT (coerce number, default 4000), NODE_ENV (enum development|test|production),
 *       LOG_LEVEL (enum, default 'info'), TRUST_PROXY (coerce boolean),
 *       REQUEST_BODY_LIMIT (string, default '100kb'),
 *       CORS_ORIGINS (comma-separated -> string[]), COOKIE_SECURE (coerce boolean),
 *       COOKIE_DOMAIN (string), DATABASE_URL (url), REDIS_URL (url),
 *       JWT_ACCESS_SECRET / JWT_REFRESH_SECRET (string, min 32),
 *       JWT_ACCESS_TTL / JWT_REFRESH_TTL (string like '15m' / '7d').
 *   - `loadEnv(source = process.env): IEnv` -> safeParse; on failure throw an Error listing
 *     every invalid key (never print secret values). Return Object.freeze(mapped config).
 *   - Map raw names to a nested, camelCase shape (consumers never see raw env names).
 *
 * EXPORTS
 *   interface IEnv {
 *     port: number; nodeEnv: 'development' | 'test' | 'production'; logLevel: string;
 *     trustProxy: boolean; requestBodyLimit: string;
 *     cors: { origins: string[] };
 *     cookies: { secure: boolean; domain: string };
 *     database: { url: string };
 *     redis: { url: string };
 *     jwt: { accessSecret: string; refreshSecret: string; accessTtl: string; refreshTtl: string };
 *   }
 *   function loadEnv(source?: NodeJS.ProcessEnv): IEnv
 *
 * USED BY
 *   src/server.ts  -> `const config = loadEnv();` (first statement after `import 'dotenv/config'`)
 *   src/app.ts     -> receives `config: IEnv` as a parameter (type import only)
 *   src/modules/*  -> receive the slices they need (e.g. config.jwt) via ISharedDependencies
 *   tests/helpers/buildTestApp.ts -> `loadEnv({ ...testEnv })` with an explicit object
 *
 * MAY IMPORT
 *   zod only. Nothing from domain/, use-cases/, infrastructure/, interface/.
 */
export {};
