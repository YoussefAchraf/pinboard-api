# AGENTS.md - et-be file contract

Backend template: Express 5 + TypeScript, Clean Architecture, Prisma 7 + PostgreSQL, Redis, Docker.
This file says WHERE things go and WHAT each file contains. It is read by every AI tool that works
in `et-be/` (Codex, Claude via `CLAUDE.md`, others) - keep it tool-agnostic.

> **Read first, every session:**
> 1. `../agents/PROTOCOL.md` - the three-agent team protocol (channels, notes, engineering rules).
> 2. `AGENTS-SENIOR-BACKEND-DB.md` - your role, working protocol, no-hallucination rules, scale & tenancy playbook, definition of done.
> 3. `docs/AGENT-NOTES.md` - **your memory** from previous sessions. Rewrite it at the end of every session.
> 4. `../contracts/profile.md` + `../contracts/conventions.md` - project profile and cross-stack rules. They override any prose here.
> 5. Your task brief in `../contracts/tasks/` and the last entries of `docs/PROGRESS.md`.

## 1. Scope & ownership

- You own `et-be/**` only. Never edit `rt-fe/**`, `contracts/**`, `agents/**` or root files.
- Need something outside your scope? File a request (section 12). Never work around a contract.

## 2. Architecture

```
src/
  server.ts               composition root: PROCESS (env, logger, http server, listen, graceful shutdown)
  app.ts                  composition root: WIRING (shared adapters, global middleware, mounts modules)
  modules/                composition root: one <feature>Module.ts per feature + index.ts registry + types.ts
  config/env.ts           the ONLY reader of process.env (zod-validated, fail fast)
  domain/                 pure business: entities/, interfaces/ (ports), errors/, constants/, validation/, utils/
  use-cases/<feature>/    one class per action, single public execute()
  infrastructure/         adapters implementing domain ports: database/, repositories/, security/,
                          cache/, services/, realtime/ (optional module)
  interface/              HTTP: controllers/, routes/, middlewares/, validation/ (zod), presenters/
  docs/                   OpenAPI spec (swaggerDefinition.ts + <feature>Docs.ts fragments)
  generated/              Prisma client output - gitignored, never edited, imported only by infrastructure/
tests/                    unit/ integration/ e2e/ smoke/ fixtures/ helpers/  (see tests/README.md)
scripts/                  one-off ops scripts (see scripts/README.md)
prisma/                   schema.prisma + migrations/ (Prisma Migrate is the ONLY migration system)
docker/postgres/init/     first-boot DB init (creates the <db>_dev database)
```

### Dependency rule (lint-enforced by eslint-plugin-boundaries)

```
domain        <- imports nothing outside domain
use-cases     -> domain
infrastructure-> domain, generated
interface     -> domain, use-cases
docs          -> docs, domain
config        -> config (and zod)
composition root (server.ts, app.ts, modules/) -> everything
```

Framework imports are restricted per folder (eslint `no-restricted-imports`):

| Folder | express | @prisma/client / generated | ioredis | socket.io | process.env | console |
|---|---|---|---|---|---|---|
| domain/, use-cases/ | no | no | no | no | no | no |
| infrastructure/ (general) | no | yes | yes | no | no | allowed but use ILogger |
| infrastructure/database/, repositories/ | no | yes | no | no | no | - |
| infrastructure/realtime/ | no | yes | yes | yes | no | - |
| interface/ | yes | no | no | no | no | - |
| config/ | - | - | - | - | **yes (only here)** | - |

### Request lifecycle (read this before touching HTTP code)

```
request
 -> requestContextMiddleware (X-Request-Id, AsyncLocalStorage)   -> pino-http
 -> /health, /ready (healthModule - before rate limiting)
 -> helmet -> cors -> express.json(limit) -> cookieParser -> sanitizeMiddleware
 -> global rate limiter -> csrfMiddleware (global; only /v1/auth/login exempt)
 -> /v1/<feature> router (from src/modules/<feature>Module.ts)
      -> [authMiddleware] -> [requireRole(...)] -> [validate({ body, params, query })]
      -> Controller method -> UseCase.execute() -> Repository / ports -> domain entity
      -> Presenter (entity -> response DTO) -> res.json
 -> notFoundMiddleware -> errorHandlerMiddleware ({ error, code } envelope)
```

## 3. Placeholder files - the header IS the contract

Every file listed below already exists as a placeholder whose header comment states: PURPOSE,
WHAT TO WRITE, EXPORTS, USED BY, MAY IMPORT. Rules:

- **Implement in place.** Never create a parallel file with a similar name.
- Replace `export {};` with the implementation, change `STATUS: placeholder` to
  `STATUS: implemented`, and keep the header accurate (trim the WHAT TO WRITE section to what is
  not obvious from the code).
- A new file must follow the same header format and match a naming pattern in section 4.

| Area | Files |
|---|---|
| Composition | `src/server.ts`, `src/app.ts` (compiling stubs), `src/modules/{types,index,healthModule,authModule}.ts` |
| Config | `src/config/env.ts` |
| Domain | `entities/User.ts`, `errors/{AppError,errorCodes}.ts`, `constants/roles.ts`, `interfaces/{IUserRepository,IUnitOfWork,ILogger,IPasswordHasher,ITokenService,IRefreshTokenStore,IReadinessProbe}.ts` |
| Use cases | `use-cases/auth/{Login,RefreshSession,Logout,GetCurrentUser}UseCase.ts` |
| Infrastructure | `database/{prismaClient,PrismaUnitOfWork}.ts`, `repositories/PgUserRepository.ts`, `security/{PasswordHasher,TokenService,RefreshTokenStore,CsrfTokenService}.ts`, `cache/RedisClient.ts`, `services/PinoLogger.ts` |
| Interface | `controllers/{Auth,Health}Controller.ts`, `routes/{auth,health}Routes.ts`, `middlewares/{requestContext,auth,requireRole,csrf,rateLimiter,sanitize,validateRequest,notFound,errorHandler}Middleware.ts`, `validation/authSchemas.ts`, `presenters/UserPresenter.ts` |
| Docs | `src/docs/{swaggerDefinition,authDocs}.ts` |
| Tests | `tests/helpers/{buildTestApp,inMemoryUserRepository}.ts`, `tests/fixtures/makeUser.ts` |
| Scripts | `scripts/{exportSwagger,seedAdmin,provisionDbRoles}.ts` |

The auth slice is the REFERENCE SLICE: every future feature copies its shape.

## 4. Naming & file patterns (lint-enforced where marked)

| Kind | Folder | File / symbol pattern | Lint |
|---|---|---|---|
| Entity | `domain/entities/` | `<Thing>.ts` -> `class <Thing>` (no suffix) + `I<Thing>Props` | - |
| Port (interface) | `domain/interfaces/` | `I<Thing>.ts`; repositories `I<Thing>Repository` | yes |
| Error code | `domain/errors/errorCodes.ts` | `UPPER_SNAKE` key = value | - |
| Use case | `use-cases/<feature>/` | `<Verb><Thing>UseCase.ts`, only public method `execute` | yes |
| Repository | `infrastructure/repositories/` | `Pg<Thing>Repository.ts` implements `I<Thing>Repository` | yes |
| Service / adapter | `infrastructure/<area>/` | `<Thing>Service.ts` (PascalCase, ends in Service) or named adapter (`RedisClient`, `PinoLogger`) | yes |
| Controller | `interface/controllers/` | `<Thing>Controller.ts`, methods by intent: `list, show, create, update, remove` (+ action verbs like `login`) - never `getX/postX` | yes |
| Routes | `interface/routes/` | `<feature>Routes.ts` -> `export function <feature>Routes(deps): Router` | yes |
| Middleware | `interface/middlewares/` | `<thing>Middleware.ts` -> factory function | - |
| Schemas | `interface/validation/` | `<feature>Schemas.ts` -> `<action>Schema` constants | - |
| Presenter | `interface/presenters/` | `<Thing>Presenter.ts` -> `present<Thing>(entity)` + `I<Thing>Response` | - |
| Module | `src/modules/` | `<feature>Module.ts` -> `create<Feature>Module: FeatureModuleFactory` | - |
| OpenAPI fragment | `src/docs/` | `<feature>Docs.ts` -> `<feature>Paths` | - |
| Interfaces / types / generics | anywhere | `I` prefix / PascalCase / `T` prefix | yes |

## 5. Design patterns used (and where)

- **Clean Architecture + Dependency Inversion:** use cases depend on ports in `domain/interfaces/`; adapters in `infrastructure/` implement them; only the composition root knows concrete classes.
- **Feature modules:** `src/modules/<feature>Module.ts` wires one feature (use cases -> controller -> routes) from `ISharedDependencies`. Adding a feature = new module + one line in `src/modules/index.ts`; `app.ts` is not touched.
- **Repository + Unit of Work:** one repository per aggregate; multi-aggregate writes go through `IUnitOfWork.run()` (no Prisma in use cases).
- **Presenter:** controllers never `res.json(entity)`; `present<Thing>()` is the whitelist of public fields.
- **Single error type:** `AppError(code, message, status)` + the `ERROR_CODES` catalog; one global error handler produces `{ error, code, details? }`.
- **Ports for cross-cutting concerns:** `ILogger` (pino, requestId-aware), `IPasswordHasher`, `ITokenService`, `IRefreshTokenStore`, `IReadinessProbe`.
- **Pragmatic CQRS (single model):** commands (`Create/Update/Archive/Send...`) go through entities and enforce invariants; queries (`List/Get/Search/Report...`) may return read DTOs from a dedicated repository method. No separate read database unless measured.

Neutral examples used throughout the docs: `CreateProjectUseCase`, `ArchiveProjectUseCase`,
`ListOverdueTasksQuery`, `PgProjectRepository`, route `/v1/projects/:projectId/tasks`.

## 6. Adding a feature (recipe)

1. Contract exists in `../contracts/openapi/<feature>.yaml` (manager). If not -> request (section 12).
2. Prisma model in `prisma/schema.prisma` -> `npm run db:migrate -- --name <change>`.
3. Domain: `entities/<Thing>.ts`, `interfaces/I<Thing>Repository.ts`, new codes in `errors/errorCodes.ts`.
4. Infrastructure: `repositories/Pg<Thing>Repository.ts` (+ add to `ITransactionScope` if it joins transactions).
5. Use cases: `use-cases/<feature>/<Verb><Thing>UseCase.ts`, one per action.
6. Interface: `validation/<feature>Schemas.ts`, `presenters/<Thing>Presenter.ts`, `controllers/<Thing>Controller.ts`, `routes/<feature>Routes.ts`.
7. Composition: `src/modules/<feature>Module.ts` + one line in `src/modules/index.ts`.
8. Docs: `src/docs/<feature>Docs.ts` + spread into `swaggerDefinition.ts` -> `npm run docs:export`.
9. Tests: unit per use case, integration per repository method, e2e per route (tests/README.md).
10. Docs: `docs/features/<feature>.md` (from `_TEMPLATE.md`), CHANGELOG `[Unreleased]` line, `npm run docs:readme` (`../agents/PROTOCOL.md` section 11); `docs/PROGRESS.md` entry.

## 7. Conventions

- **Env:** only `src/config/env.ts` reads `process.env`; everything else receives typed config by constructor.
- **Errors:** throw `AppError` with a code from `ERROR_CODES`; codes are a public contract (frontend mirrors them).
- **Validation:** zod at the interface layer via `validate({ body, params, query })`; invariants in entities.
- **Auth:** JWT access (<= 15 min) + rotating refresh in httpOnly cookies; refresh tokens stored hashed in Redis with reuse detection; CSRF double-submit enforced globally.
- **Rate limiting:** `createRateLimiter()` with a distinct prefix per concern (`rl:global:`, `rl:login:`...).
- **Caching:** only through `RedisClient` (`getJson` / `setJson` with mandatory TTL); key format `<domain>:<entity>:<id>:<facet>`.
- **Database:** Prisma Migrate only; repositories map rows with `mapRow`; raw SQL only as parameterized tagged templates.
- **Logging:** `ILogger` only (no `console` in src/ outside the stubs); never log secrets, tokens, passwords or raw PII.
- **API:** routes under `/v1`; plural kebab-case resources; cursor pagination `{ items, nextCursor }`; dates ISO 8601 UTC.
- **Health:** `/health` = liveness (no I/O); `/ready` = readiness (all probes).

## 8. Optional modules (NOT in core - add only when a task requires it)

| Module | Install | Where | Also |
|---|---|---|---|
| Email | `nodemailer` + a template engine | `infrastructure/services/EmailService.ts` behind `domain/interfaces/IEmailSender.ts` | SMTP vars in env.ts + .env.example |
| Uploads | `multer` + `file-type` | `interface/middlewares/uploadMiddleware.ts`, storage adapter in `infrastructure/services/` | magic-byte validation, storage volume in compose |
| Scheduler | `node-cron` | `infrastructure/services/<Thing>SchedulerService.ts` (`start/stop`) returned via `IFeatureModule.schedulers` | Redis lock for single-run jobs |
| Realtime | `socket.io` | `infrastructure/realtime/` (see its `.gitkeep`) | attach in `server.ts`; cookie auth via `ITokenService` |

Adding a module is a dependency decision: note it in the task result and `docs/PROGRESS.md`.

## 9. Commands

```bash
cp .env.example .env
npm install && npx prisma generate
docker compose up -d postgres redis          # local infra
npm run dev                                  # http://localhost:4000/health
npm run db:migrate -- --name <change>        # create + apply a migration (dev)
npm run verify                               # LOCAL PIPELINE: lint + typecheck + tests - mandatory before every push
npm run docs:export                          # refresh docs/openapi.json (commit it) whenever routes change
docker compose --profile dev up backend-dev  # containerized hot reload on :4002
```

### Branches & pipeline (details: `../agents/PROTOCOL.md` sections 5.0, 5.2 and 9)

- **Git hooks** are installed by `npm install` (`.githooks/` + `scripts/git-hooks.mjs`): commit format and no AI
  attribution on commit; no `.env`/secrets/BOM on commit; branch name, CHANGELOG line, lockfile sync, up to date with
  `origin/dev` and the full `npm run verify` on push. Never use `--no-verify`; a block is a defect to fix.
- Branch behind `dev` or a PR conflict: follow `../agents/PROTOCOL.md` 9.5 (merge `origin/dev`, keep both intents,
  re-verify, push).

- Work only on the branch named in your brief: `<type>/<NNN>-<slug>` (`feature/`, `fix/`, `refactor/`, `perf/`,
  `test/`, `docs/`, `chore/`, `ci/`; `hotfix/` from `main` only when the manager says so). Never commit to `dev`/`main`.
- Pushing the branch runs `verify` (lint, typecheck, tests with Postgres 16 + Redis 7 services, boundaries report,
  `npm audit`, gitleaks, OpenAPI drift) and, if green, opens the PR into `dev` with auto-merge. PRs also run a
  Docker build + Trivy scan; `main` builds and pushes the image.
- Backend-specific first-time-pass checklist: layer imports match section 2 (boundaries); no `process.env`
  outside `src/config/env.ts`; no `console` in `src/`; use-case classes end in `UseCase` with only
  `execute()` public; repositories named `Pg<Thing>Repository`; tests deterministic (inject time/ids);
  integration tests clean their data; `docs/openapi.json` regenerated and committed when routes change;
  no secrets in fixtures (gitleaks).

## 10. Testing expectations

See `tests/README.md`. Minimum per task: unit test per use case, integration test per new
repository method, e2e test per new route, regression test per bug fix.

## 11. Policies

- **No AI attribution** anywhere: never write an AI tool/vendor name (Claude, Codex, OpenAI, Gemini, Copilot, Cursor, ...) in commit messages, trailers, author identity, branch names, PRs, code comments or docs. Commits: `type(<NNN>): summary`, no trailers. There is no CI check - run the self-check in `../agents/PROTOCOL.md` section 5.1 before every commit and every push.
- **Encoding:** UTF-8 without BOM, LF line endings; prefer ASCII in code and comments.
- **No PWA / web-push** work in this stack (permanent workspace policy).

## 12. Requests (the only way to reach the frontend or the manager)

You never coordinate with the frontend agent directly. Write one file per need in
`../contracts/requests/` from `_TEMPLATE.md` (rules: `../contracts/requests/README.md`):

| You need | File |
|---|---|
| The contract is unsafe, ambiguous or too expensive to serve | `be-<NNN>-contract-issue-<slug>.md` |
| The frontend must change something (send a header, handle a new error code, stop using a mock resource) | `be-<NNN>-client-needs-<slug>.md` |
| A choice outside your authority (new runtime dependency, data-losing migration, pattern change) | `be-<NNN>-decision-<slug>.md` |
| You cannot continue | `be-<NNN>-blocker-<slug>.md` |

1. Never amend `contracts/` yourself and never silently deviate from the contract - the request is how the change happens. Never implement a requested (pending) shape before the manager resolves it.
2. Continue with the best contract-compliant implementation meanwhile; record the request in your task result and in `docs/AGENT-NOTES.md` ("Waiting on").
3. The manager resolves it (`## Resolution` in your file) and issues tasks to whichever app must change.
