# tests/

Mirrors the architecture. Jest + ts-jest (`jest.config.js`, compiled with `tsconfig.eslint.json`).
Only files named `*.test.ts` are run. Do not add empty `*.test.ts` placeholders - Jest fails on a
test file with no tests.

| Folder | What goes here | Naming | Runs against |
|---|---|---|---|
| `unit/` | One file per use case (and per pure domain util/entity rule). Dependencies are in-memory doubles from `helpers/`. | `<Thing>UseCase.test.ts`, `User.test.ts` | Nothing external |
| `integration/` | One file per repository / adapter. Real Postgres + Redis. | `Pg<Thing>Repository.test.ts`, `RefreshTokenStore.test.ts` | CI service containers or `docker compose up -d postgres redis` |
| `e2e/` | One file per feature's routes, through `buildTestApp()` + supertest. Assert status codes, cookies, the `{ error, code }` envelope, and contract shapes. | `<feature>.routes.test.ts` | Real Postgres + Redis |
| `smoke/` | Boots the app, hits `/health` and `/ready`. | `health.test.ts` | Real Postgres + Redis |
| `fixtures/` | Object mothers: valid domain objects with overridable fields. | `make<Thing>.ts` | - |
| `helpers/` | Shared builders: `buildTestApp`, in-memory repositories, DB reset. | camelCase | - |

## Rules

- Unit tests never touch the network, DB, Redis or the clock (inject `idGenerator`, time, etc.).
- Every bug fix ships with a regression test in the lowest layer that reproduces it.
- Integration/e2e tests clean up their own data (truncate in `beforeEach`, or one schema per worker).
- Run: `npm test` (all), `npm run test:unit`, `npm run test:integration`, `npm run test:e2e`.
- `any` is a lint warning here (not an error); `console` is allowed.

## First tests to write (with the auth task)

1. `unit/LoginUseCase.test.ts` - valid login, unknown email, wrong password (same error), disabled user.
2. `unit/RefreshSessionUseCase.test.ts` - rotation, reuse detection revokes the session.
3. `integration/PgUserRepository.test.ts` - case-insensitive email lookup, unique email -> CONFLICT.
4. `e2e/auth.routes.test.ts` - login sets 3 cookies, whoami 401 without cookie, CSRF required on logout.
5. `smoke/health.test.ts` - `/health` 200, `/ready` 200 with deps up.
