/**
 * FILE:   src/config/env.ts
 * LAYER:  config (parsing only - no business logic, no I/O besides reading process.env)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   The ONLY place that reads process.env. Validates every variable once at boot and
 *   returns a typed, frozen config object. An invalid env must crash the process at
 *   startup with a readable message (fail fast) - never at the first request.
 *
 * NOTES
 *   - `loadEnv(source)` throws an Error listing every invalid KEY and the reason; values are never
 *     printed (they may be secrets).
 *   - Booleans accept only 'true' / 'false' (z.coerce.boolean would turn 'false' into true).
 *   - Defaults match docs/configuration.md. JWT_ACCESS_TTL must be <= 15m and the two JWT secrets
 *     must differ (contracts/conventions.md section 5).
 *   - Docker-Compose-only variables of .env.example (POSTGRES_*, REDIS_PASSWORD, PGADMIN_PASSWORD)
 *     are not read by the application and are ignored here.
 *
 * EXPORTS
 *   interface IEnv, function loadEnv(source?: NodeJS.ProcessEnv): IEnv
 *
 * USED BY
 *   src/server.ts                 `const config = loadEnv();`
 *   src/app.ts / src/modules/*    receive `config: IEnv` (or slices of it)
 *   tests/helpers/buildTestApp.ts `loadEnv({ ...TEST_ENV, ...overrides })`
 *
 * MAY IMPORT
 *   zod only. Nothing from domain/, use-cases/, infrastructure/, interface/.
 */
import { z } from 'zod';

export interface IEnv {
  port: number;
  nodeEnv: 'development' | 'test' | 'production';
  logLevel: string;
  trustProxy: boolean;
  requestBodyLimit: string;
  cors: { origins: string[] };
  cookies: { secure: boolean; domain: string };
  database: { url: string };
  redis: { url: string };
  jwt: { accessSecret: string; refreshSecret: string; accessTtl: string; refreshTtl: string };
}

const booleanString = z.enum(['true', 'false']).transform((value) => value === 'true');

// Durations accepted by the token service: a positive integer + unit (s, m, h, d), e.g. 15m, 7d.
const DURATION_PATTERN = /^(\d+)([smhd])$/;
const UNIT_SECONDS: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
const ACCESS_TTL_MAX_SECONDS = 15 * 60;

const duration = z.string().regex(DURATION_PATTERN, 'expected a duration like 15m or 7d');

function durationSeconds(value: string): number {
  const match = DURATION_PATTERN.exec(value);
  return match ? Number(match[1]) * (UNIT_SECONDS[match[2] ?? ''] ?? Number.NaN) : Number.NaN;
}

const envSchema = z
  .object({
    PORT: z.coerce.number().int().min(1).max(65535).default(4000),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
    TRUST_PROXY: booleanString.default(false),
    REQUEST_BODY_LIMIT: z
      .string()
      .regex(/^\d+(b|kb|mb)$/i, 'expected a size like 100kb')
      .default('100kb'),
    CORS_ORIGINS: z
      .string()
      .transform((value) =>
        value
          .split(',')
          .map((origin) => origin.trim())
          .filter((origin) => origin.length > 0),
      )
      .pipe(z.array(z.url()).min(1)),
    COOKIE_SECURE: booleanString.default(false),
    COOKIE_DOMAIN: z.string().min(1),
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
    REDIS_URL: z.url({ protocol: /^rediss?$/ }),
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_ACCESS_TTL: duration
      .default('15m')
      .refine((value) => durationSeconds(value) <= ACCESS_TTL_MAX_SECONDS, 'must be at most 15m'),
    JWT_REFRESH_TTL: duration.default('7d'),
  })
  .refine((env) => env.JWT_ACCESS_SECRET !== env.JWT_REFRESH_SECRET, {
    message: 'must differ from JWT_ACCESS_SECRET',
    path: ['JWT_REFRESH_SECRET'],
  });

export function loadEnv(source: NodeJS.ProcessEnv = process.env): IEnv {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    // Keys and reasons only - never the received values (they may be secrets).
    const problems = result.error.issues.map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`);
    throw new Error(`Invalid environment configuration:\n${problems.join('\n')}`);
  }
  const env = result.data;
  return Object.freeze({
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
    logLevel: env.LOG_LEVEL,
    trustProxy: env.TRUST_PROXY,
    requestBodyLimit: env.REQUEST_BODY_LIMIT,
    cors: Object.freeze({ origins: env.CORS_ORIGINS }),
    cookies: Object.freeze({ secure: env.COOKIE_SECURE, domain: env.COOKIE_DOMAIN }),
    database: Object.freeze({ url: env.DATABASE_URL }),
    redis: Object.freeze({ url: env.REDIS_URL }),
    jwt: Object.freeze({
      accessSecret: env.JWT_ACCESS_SECRET,
      refreshSecret: env.JWT_REFRESH_SECRET,
      accessTtl: env.JWT_ACCESS_TTL,
      refreshTtl: env.JWT_REFRESH_TTL,
    }),
  });
}
