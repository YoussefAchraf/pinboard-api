# Configuration

All variables are validated at boot by `src/config/env.ts` (the process exits with a readable error if
one is missing or invalid). Local values: copy `.env.example` to `.env`. Production: inject from the
platform's secret store - never commit `.env`.

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | no | `4000` | HTTP port |
| `NODE_ENV` | no | `development` | `development` \| `test` \| `production` |
| `LOG_LEVEL` | no | `info` | pino level (`debug` locally) |
| `TRUST_PROXY` | no | `false` | `true` behind a reverse proxy (nginx, load balancer) |
| `REQUEST_BODY_LIMIT` | no | `100kb` | Max JSON body size |
| `CORS_ORIGINS` | yes | - | Comma-separated exact origins allowed with credentials |
| `COOKIE_SECURE` | no | `false` | Must be `true` in production (HTTPS) |
| `COOKIE_DOMAIN` | yes | - | Cookie domain |
| `DATABASE_URL` | yes | - | PostgreSQL connection string (runtime role) |
| `REDIS_URL` | yes | - | Redis connection string (with password) |
| `JWT_ACCESS_SECRET` | yes | - | >= 32 characters, distinct from the refresh secret |
| `JWT_REFRESH_SECRET` | yes | - | >= 32 characters |
| `JWT_ACCESS_TTL` | no | `15m` | Access token lifetime (<= 15 min) |
| `JWT_REFRESH_TTL` | no | `7d` | Refresh token lifetime |

Compose-only: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `REDIS_PASSWORD`, `PGADMIN_PASSWORD`,
`DEV_PORT`, `PGADMIN_PORT`. New variables are added to `env.ts`, `.env.example` and this table in the same change.

## Local services (docker compose)

| Service | Port | Command |
|---|---|---|
| PostgreSQL 16 | 5432 (localhost only) | `docker compose up -d postgres redis` |
| Redis 7 | 6379 (localhost only) | (same) |
| Backend (production image, migrations first) | 4000 | `docker compose up -d backend` |
| Backend dev (hot reload, `<db>_dev` database) | 4002 | `docker compose --profile dev up backend-dev` |
| pgAdmin | 5051 (localhost only) | `docker compose --profile tools up -d pgadmin` |
