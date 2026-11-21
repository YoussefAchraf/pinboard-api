# Progress log

Agent-assisted work is logged here per session. Append entries; never rewrite past ones.

## Format

```
## YYYY-MM-DD — <scope/title>
- **Done:**
- **Decisions:**
- **Deferred:**
- **Validation:**
```

---

## 2026-11-20 — project created from the fs-reustemp template
- **Done:** template copied; package renamed (pinboard-api).
- **Validation:** not run in this repository yet (first task: install + verify).

## 2026-11-20 — task 001 API platform foundation
- **Done:** env.ts (zod, fail fast, defaults per docs/configuration.md, access TTL <= 15m, distinct JWT secrets);
  AppError + 9-code catalog; ILogger/IReadinessProbe; PinoLogger (redaction incl. email); createDatabase (PrismaPg +
  SELECT 1 probe); RedisClient (getJson/setJson with mandatory TTL, PING probe); middlewares requestContext,
  sanitize, rateLimiter (Redis store, key seam), validate, notFound, errorHandler; HealthController + healthRoutes;
  modules types/index/healthModule; app.ts chain (no auth pieces); server.ts with graceful shutdown; swagger
  (no paths) + exportSwagger + docs/openapi.json; User model + `init` migration; 8 test files (47 tests);
  docs/features/platform.md, CHANGELOG, README regenerated.
- **Decisions:** role/status as Postgres enums; email lowercase via hand-written CHECK + unique index; oversized
  body -> 400 VALIDATION_FAILED; 5xx AppError answered with the generic INTERNAL_ERROR body; no pretty logs
  (pino-pretty not installed); line-scoped lint disable for server.ts -> app.ts (request
  be-001-decision-lint-composition-root-policy).
- **Deferred:** auth pieces (task 003); CI `test` job applies no migrations yet (needed once tests touch `users`).
- **Validation:** `npm run verify` green (lint, policy, docs check, typecheck, 8 suites / 47 tests). `npm run dev`
  booted: /health 200, /ready 200, /v1/x 404 envelope. Invalid env -> exit 1 with key list. SIGTERM in a Linux
  container -> server.stopping / server.stopped, exit 0. Local infra on host ports 55432/56379 (5432/6379 taken
  by other projects on this machine).
