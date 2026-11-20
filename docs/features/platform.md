---
feature: platform
title: API platform foundation
status: in-progress
since: -
task: 001
summary: Validated config, structured logging with request ids, the error envelope, Postgres + Redis adapters with readiness probes, rate limiting and the feature-module registry.
endpoints:                 # none under /v1 (GET /health and GET /ready are unversioned, see Contract)
---

# API platform foundation

## Overview

The running process every feature builds on: `buildApp()` wires the shared adapters once (Prisma on a
pg pool, one Redis connection, pino), applies the global middleware chain and mounts the feature modules
from `src/modules/index.ts`. Every error leaves the API as `{ error, code, details? }`; every request
carries an `X-Request-Id`. Profile: tier `S` (ADR 0005), tenancy `single`.

## Contract

- No feature contract. Envelope, error-code catalog and headers: workspace `contracts/conventions.md`
  sections 2 and 6; port 4000 (section 9).
- `/health` and `/ready` are unversioned and not part of `contracts/openapi/` or `docs/openapi.json`:
  - `GET /health` -> 200 `{ "status": "ok" }` (liveness, no I/O).
  - `GET /ready` -> 200 `{ "status": "ready", "checks": { "postgres": "ok", "redis": "ok" } }`, or
    503 `{ "status": "not_ready", "checks": { ..., "<name>": "fail" } }`. Never error text or URLs.
- Error codes produced by the platform itself:
  - `NOT_FOUND` 404 - unknown route (`notFoundMiddleware`).
  - `VALIDATION_FAILED` 422 - `validate()` schema failure, `details.fields` = `{ "<field path>": "<i18n key>" }`
    (`validation.required`, `validation.too_big`, `validation.too_small`, `validation.email`,
    `validation.url`, `validation.invalid_format`, `validation.invalid_type`, else `validation.<zod code>`).
  - `VALIDATION_FAILED` 400, no details - malformed JSON body, body over `REQUEST_BODY_LIMIT` (we return
    400, not 413), unsupported body charset/encoding.
  - `RATE_LIMITED` 429 + `Retry-After` - any `createRateLimiter()` limiter.
  - `INTERNAL_ERROR` 500 - anything unexpected (and any 5xx `AppError`): generic message, no details,
    logged with the request id.

## How it works

```
request -> requestContext (X-Request-Id, AsyncLocalStorage) -> pino-http
        -> /health, /ready (healthModule - before the limiter, never throttled)
        -> helmet -> cors (CORS_ORIGINS, credentials) -> express.json(REQUEST_BODY_LIMIT) -> cookieParser
        -> sanitize (strip HTML from body strings, `password` skipped)
        -> global limiter rl:global: 300/min per IP (Redis store)
        -> /api-docs, /api-docs.json (not in production)
        -> /v1/<module> routers -> notFound -> errorHandler
```

- `X-Request-Id`: an incoming value matching 8-64 `[A-Za-z0-9_-]` is kept, otherwise a UUID is
  generated; echoed on every response and attached to every log line (`requestId`, pino-http `req.id`).
- Rate limiting: `createRateLimiter({ prefix, windowMs, limit, key? })` (express-rate-limit 8 +
  rate-limit-redis, `RateLimit` / `RateLimit-Policy` draft-7 headers). `key(req)` is the seam for
  per-user limits (task 003); without it the key is the client IP (IPv6 /56 via `ipKeyGenerator`).
  A Redis failure in the limiter is not swallowed: the request fails with 500.
- Readiness: all probes run in parallel, each bounded by 2 s; a probe that rejects or times out is `fail`.
- Shutdown (SIGTERM / SIGINT, or after an unhandled rejection / uncaught exception): stop schedulers ->
  close the HTTP server (drain, hard timeout 10 s) -> Prisma disconnect -> Redis quit; exit code 1 if a
  step failed.
- Invalid environment: `loadEnv()` throws a message listing each invalid key and reason (never the
  value); `server.ts` prints it to stderr and exits with code 1.

## Code map

| Layer | Files |
|---|---|
| Config | `src/config/env.ts` |
| Domain | `src/domain/errors/{AppError,errorCodes}.ts`, `src/domain/interfaces/{ILogger,IReadinessProbe}.ts` |
| Infrastructure | `src/infrastructure/database/prismaClient.ts`, `src/infrastructure/cache/RedisClient.ts`, `src/infrastructure/services/PinoLogger.ts` |
| Interface | `src/interface/middlewares/{requestContext,sanitize,rateLimiter,validateRequest,notFound,errorHandler}Middleware.ts`, `src/interface/controllers/HealthController.ts`, `src/interface/routes/healthRoutes.ts` |
| Composition | `src/app.ts`, `src/server.ts`, `src/modules/{types,index,healthModule}.ts` |
| Docs | `src/docs/swaggerDefinition.ts` (no paths yet), `scripts/exportSwagger.ts` -> `docs/openapi.json` |

## Data

Migration `prisma/migrations/<timestamp>_init` creates table `users` (model `User`,
workspace `contracts/domain-model.md` section 2) - no repository yet (task 003):

| Column | Type | Rule |
|---|---|---|
| `id` | uuid PK | Prisma default `uuid()` |
| `email` | varchar(254) | unique index `users_email_key` + CHECK `users_email_lowercase` (`email = lower(email)`): stored lowercase, so uniqueness is case-insensitive |
| `password_hash` | text | never exposed |
| `firstname`, `lastname` | varchar(100) | CHECK non-empty (`users_firstname_not_empty`, `users_lastname_not_empty`) |
| `role_name` | enum `role_name` (`admin`, `member`) | default `member` |
| `status` | enum `user_status` (`active`, `disabled`) | default `active` |
| `created_at`, `updated_at` | timestamptz(3) | server-set |

Enum values are constrained with **Postgres enums** (Prisma `enum`), chosen over CHECK constraints: the
generated client types them, and with 2 stable values each the migration cost of adding a value is low.
The three CHECK constraints are hand-written in the migration SQL (Prisma cannot express them); Prisma
ignores CHECK constraints when diffing, so `prisma migrate dev` reports no drift. No extra index: 50 users
at most, lookups by email (unique index) and id (PK).

## Configuration

All variables of `.env.example` (table in `docs/configuration.md`). Rules enforced by `env.ts` beyond
types: `JWT_ACCESS_TTL` <= 15m, `JWT_ACCESS_SECRET` != `JWT_REFRESH_SECRET`, booleans only `true`/`false`,
`DATABASE_URL` scheme `postgres(ql)`, `REDIS_URL` scheme `redis(s)`, `CORS_ORIGINS` at least one URL.

## Testing

| Test | Covers |
|---|---|
| `tests/unit/AppError.test.ts` | AppError fields/helpers, catalog = 9 codes |
| `tests/unit/errorHandlerMiddleware.test.ts` | envelope, 404, 5xx without details/stack (sync, async, 5xx AppError), malformed JSON and oversized body -> 400 |
| `tests/unit/validateRequestMiddleware.test.ts` | 422 + `details.fields` i18n keys, stripping, res.locals.validated |
| `tests/unit/HealthController.test.ts` | /health runs no probe; /ready 200, 503 on failing / hanging probe, no error text |
| `tests/unit/env.test.ts` | mapping, defaults, rejected values, message never echoes values |
| `tests/unit/sanitizeAndLogging.test.ts` | HTML stripping + skipFields; log redaction and request id |
| `tests/smoke/health.test.ts` | /health, /ready 200 against real Postgres + Redis |
| `tests/e2e/platform.routes.test.ts` | 404 envelope, X-Request-Id echo/generate/replace, malformed JSON, helmet/CORS, limiter headers, 429 + Retry-After (real Redis) |

Run: `docker compose up -d postgres redis`, then `npm test` (smoke/e2e need both services).

## Operational notes

- Log lines are JSON (pino); `requestId` correlates them. Redacted: cookies, `Authorization`,
  `X-CSRF-Token`, `Set-Cookie`, and any `password`, `passwordHash`, `token`, `accessToken`,
  `refreshToken`, `csrfToken`, `email` key (top level or one level deep).
- Redis connection errors are logged as `redis.error` (warn) while ioredis reconnects.
- `/ready` 503 = take the instance out of rotation; `/health` only tells the process is alive.
