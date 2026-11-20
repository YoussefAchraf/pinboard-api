# Backend agent notes (working memory)

Rewritten at the end of every backend session (rules: `../../agents/PROTOCOL.md` section 6).
This is the backend agent's memory across sessions and AI tools. Never store secrets or personal data.

## 1. Snapshot (2026-11-20)

PinBoard project created from the template; nothing implemented yet. Template baseline: `npm run verify` was
green in the template on 2026-11-20. Contract: `../../contracts/openapi/auth.yaml`.

## 2. Active work

None. Wait for a task brief in `../../contracts/tasks/`.

## 3. Project knowledge

- (empty - filled from the manager's contracts)

## 4. Verified facts

Installed versions (2026-11-20): express 5.3.0, prisma / @prisma/client / @prisma/adapter-pg 7.10.1,
express-rate-limit 8.7.5, rate-limit-redis 6.0.2, zod 4.6.7, pino 10.4.0, pino-http 11.0.0, ioredis 6.0.0, jest 30.5.2.

- prisma 7.10.1 - `prisma.config.ts` with `defineConfig` from `prisma/config` + `datasource.url`; generator
  `prisma-client` with `moduleFormat = "cjs"` and `binaryTargets` accepted - verified: `npx prisma generate` OK.
- @prisma/adapter-pg 7.10.1 - `new PrismaPg(pool | poolConfig | connectionString, options?)` - verified: dist d.ts.
- eslint-plugin-boundaries 7.4.4 - element patterns match FOLDERS; single files use `boundaries/files`
  (`{ pattern, category }`) and policies `from: { file: { categories } }`; `partialMatch`/`mode: 'file'` on elements
  warn - verified: README + types + violation test (12/12 planted violations caught).
- express-rate-limit 8.7.5 - options `limit`, `standardHeaders` (incl. draft versions), `legacyHeaders`,
  `keyGenerator`, `handler`; rate-limit-redis 6.0.2 - `sendCommand` - verified: dist d.ts.
- zod 4.6.7 - `config({ customError })` exists - verified: zod/v4/core/core.d.ts.
- @typescript-eslint ban-ts-comment: `@ts-ignore` banned, `@ts-expect-error` needs >= 15 char description - verified: chaos test.
- Node: several dev dependencies require node >= 22.22.2 (engines field set accordingly).

## 5. Decisions & contract versions relied on

- ADR 0002 (cookie auth + CSRF), ADR 0003 (envelope, pagination, /v1), ADR 0004 (protocol).
- CSRF enforced globally, login exempt (`src/interface/middlewares/csrfMiddleware.ts` header).
- Feature modules in `src/modules/` - app.ts is not edited per feature.
- Contract versions: `auth.yaml 1.0.0` (placeholders follow it; not implemented yet).

## 6. Pitfalls learned

- Flat ESLint config: a later block setting the same rule REPLACES the earlier one - declare complete lists.
- A comment that merely STARTS with `@ts-ignore` is treated as the directive - never start comments with it.
- Without `.gitattributes`, Windows git (system autocrlf) rewrites every line -> whole-file diffs. Keep the file.
- Git hooks block bad commits/pushes (`../../agents/PROTOCOL.md` 5.2) - fix the cause, never `--no-verify`.
- Branch behind `origin/dev` -> merge it, re-verify (two green branches can break dev together - chaos test C2).
- Never claim a check passed without running it; record "not run" explicitly.

## 7. Waiting on

- Nothing.
