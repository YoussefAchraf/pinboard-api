# scripts/

One-off operational TypeScript scripts, run with ts-node through npm scripts. `console` is
allowed here; scripts are never imported by `src/`, but they MAY import from `src/` (config
loader, adapters) to reuse the real wiring. No tests required, but every script must be
idempotent (safe to run twice).

| Script | npm command | Status | What it does |
|---|---|---|---|
| `exportSwagger.ts` | `npm run docs:export` | placeholder | Writes `src/docs/swaggerDefinition.ts` -> `docs/openapi.json` (CI "openapi drift" job compares it). |
| `seedAdmin.ts` | `npm run db:seed-admin` | placeholder | Creates the first admin user from env vars if it does not exist. |
| `provisionDbRoles.ts` | `npm run db:provision-roles` | placeholder | Creates least-privilege Postgres roles: `app_runtime` (DML only) and `app_migrator` (DDL). |

Each file's header comment is its implementation contract.
