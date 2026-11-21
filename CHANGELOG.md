# Changelog

All notable changes to et-be. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [Semantic Versioning](https://semver.org/).

- Every task adds a line under **Unreleased** (Added / Changed / Fixed / Removed / Security), with its task id.
- The release task (when `dev` is promoted to `main`) renames **Unreleased** to the new version and date,
  sets `since:` on the released feature pages, and runs `npm run docs:readme`.

## [Unreleased]

### Added

- API platform foundation: validated config, pino logging with request ids, error envelope, Postgres + Redis adapters with `/health` and `/ready`, Redis-backed rate limiting, `users` table migration (001)
