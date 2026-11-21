# Backend agent notes (working memory)

Rewritten at the end of every backend session (rules: `../../agents/PROTOCOL.md` section 6).
This is the backend agent's memory across sessions and AI tools. Never store secrets or personal data.

## 1. Snapshot (2026-11-21)

Task 001 merged into `dev` (e81f858). Task 005 (CI migrate before tests) done on `ci/005-migrate-before-tests`,
PR #9 into `dev` open, CI green, status `review` (manager merges - no auto-merge token). `npm run verify` green
locally (8 suites, 47 tests). Next: task 003 (auth API) - start only after 005 is merged.

## 2. Active work

- 005: `review` - wait for the manager's review in `../../contracts/tasks/005-be-ci-migrate-before-tests.md`.
  If `changes-requested`: fix on the same branch, `git merge origin/dev` if behind, re-run verify, push.
- Next task 003 (after 005 merged): branch from fresh `origin/dev`; extends `ISharedDependencies` (unitOfWork,
  repositories.users, security, http.authMiddleware), adds csrfMiddleware to `app.ts` after the global limiter,
  passes `key: (req) => req.auth?.userId` to limiters; also delivers ADR 0006 (be-001 lint policy).

## 3. Project knowledge

- Local machine: host ports 5432 and 6379 are taken by other projects. Run infra with an override file that
  remaps to 127.0.0.1:55432 / 56379 (compose `ports: !override`), kept outside the repo; local `.env` points
  DATABASE_URL/REDIS_URL there. CI uses its own service containers (DB `pinboard_test`, Redis db 1, no password).
- Tests: `tests/helpers/buildTestApp.ts` loads `.env` via dotenv (quiet) and takes only DATABASE_URL/REDIS_URL from
  it; everything else is TEST_ENV. Smoke/e2e need Postgres + Redis up.
- CI `test` job (task 005): job-level `DATABASE_URL`, step `npm run db:deploy` runs before `npm test -- --runInBand`,
  so the CI DB has every committed migration. A new migration is applied in CI automatically.
- Python is not installed on this machine (Git Bash); use node or the Edit tool for scripted edits.
- `users`: role/status are Postgres enums (`role_name`, `user_status`); email lowercase enforced by CHECK
  `users_email_lowercase` + unique index; names non-empty CHECKs. CHECKs are hand-written in the migration SQL.
- `/health` and `/ready` are not in `docs/openapi.json`; feature page `platform.md` therefore has empty `endpoints:`
  (the docs drift check requires every listed endpoint to be in the exported spec, under `/v1`).
- Graceful shutdown cannot be exercised on Windows (no real SIGTERM); verified in a `node:22-alpine` container
  with `docker kill --signal SIGTERM`.

## 4. Verified facts

Installed versions (2026-11-20): express 5.3.0, prisma / @prisma/client / @prisma/adapter-pg 7.10.1,
express-rate-limit 8.7.5, rate-limit-redis 6.0.2, zod 4.6.7, pino 10.4.0, pino-http 11.0.0, ioredis 6.0.0,
jest 30.5.2, dotenv 17.4.2, xss 1.0.17, helmet 8.3.0, cors 2.8.6, supertest 7.3.2. pino-pretty NOT installed.

- prisma 7.10.1 - `prisma.config.ts` with `defineConfig` + `datasource.url`; generator `prisma-client`, cjs - verified: generate OK.
- prisma 7.10.1 - CLI reads the URL from `prisma.config.ts` (`process.env['DATABASE_URL']` after `import 'dotenv/config'`); `schema.prisma` datasource has no url. A `DATABASE_URL` already in the process env wins over `.env` (dotenv does not override); no `.env` in CI, so the job env is used - verified: local `DATABASE_URL=<empty db> npm run db:deploy` applied `init` to that db, and CI log `Datasource "db": ... "pinboard_test"` (run 44876607280).
- prisma 7.10.1 - CHECK constraints added by hand to a migration are ignored by `migrate dev` diffing (no drift) - verified: second `migrate dev` "Already in sync".
- @prisma/adapter-pg 7.10.1 - `new PrismaPg(pool | poolConfig | connectionString, options?)` - verified: dist d.ts + running /ready.
- express-rate-limit 8.7.5 - sets `Retry-After` itself before calling `handler` when standard/legacy headers are on; custom `keyGenerator` whose source mentions `req.ip` must call `ipKeyGenerator` (else throws ERR_ERL_KEY_GEN_IPV6 at creation); `passOnStoreError` default false - verified: dist/index.cjs + e2e 429 test.
- rate-limit-redis 6.0.2 - named export `RedisStore`, `sendCommand: (...args: string[]) => Promise<RedisReply>` - verified: d.ts.
- ioredis 6.0.0 - named export `Redis`; `call(command, ...args)`; `status === 'end'` after quit - verified: d.ts + tests.
- zod 4.6.7 - `z.url({ protocol: RegExp })`, `z.email()`, `z.uuid()`; issue `invalid_format` has `format`; object `.refine` runs only when the shape parsed - verified: d.ts + unit tests.
- dotenv 17.4.2 - `config({ quiet: true })` suppresses the tip log - verified: lib/main.d.ts.
- pino 10.4.0 - `redact: { paths, censor }`; wildcard `*.key` matches one level deep only (top-level keys need their own path) - verified: unit test.
- ES2022 class fields: a declared optional field (`details?: unknown`) exists as an own property set to undefined - test with `toBeUndefined()`, not `in`.
- eslint-plugin-boundaries 7.4.4 - element patterns match FOLDERS; single files via `boundaries/files`; NO policy lets a composition-root FILE import another (server.ts -> app.ts) - verified: lint error, request filed.
- @typescript-eslint ban-ts-comment: `@ts-ignore` banned, `@ts-expect-error` needs >= 15 char description.
- Node: dev dependencies want node >= 22.22.2; this machine runs 22.20.0 (works, engines warning only).

## 5. Decisions & contract versions relied on

- ADR 0002 (cookie auth + CSRF), ADR 0003 (envelope, pagination, /v1), ADR 0004 (protocol), ADR 0005 (tier S).
- conventions.md sections 1, 2 (9 codes), 6 (X-Request-Id 8-64 `[A-Za-z0-9_-]`, Retry-After), 9 (port 4000).
- Body over REQUEST_BODY_LIMIT -> 400 VALIDATION_FAILED (documented in `docs/features/platform.md`).
- 5xx AppError -> generic INTERNAL_ERROR body; 4xx AppError details are exposed in every environment.
- Feature modules in `src/modules/`; unversioned modules mounted before the global limiter, versioned under /v1 after it.
- Contract versions: `auth.yaml 1.0.0` (not implemented yet). `domain-model.md` User 2026-11-20.

## 6. Pitfalls learned

- Flat ESLint config: a later block setting the same rule REPLACES the earlier one - declare complete lists.
- A comment that merely STARTS with `@ts-ignore` is treated as the directive - never start comments with it.
- Without `.gitattributes`, Windows git (system autocrlf) rewrites every line -> whole-file diffs. Keep the file.
- Git hooks block bad commits/pushes (`../../agents/PROTOCOL.md` 5.2) - fix the cause, never `--no-verify`.
- Branch behind `origin/dev` -> merge it, re-verify (two green branches can break dev together).
- Feature page `endpoints:` must list only `/v1` operations present in `docs/openapi.json` (docs:check fails otherwise).
- Never claim a check passed without running it; record "not run" explicitly.

## 7. Waiting on

- `../../contracts/requests/be-001-decision-lint-composition-root-policy.md` - scheduled (ADR 0006, delivered in
  task 003: add the composition-root file->file policy, remove the line-scoped disable in `src/server.ts`).
- Manager review + merge of PR #9 (task 005).
