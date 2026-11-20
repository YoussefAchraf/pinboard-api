/**
 * FILE:   scripts/seedAdmin.ts             (npm run db:seed-admin)
 * STATUS: placeholder - implement after the User model and PgUserRepository exist.
 *
 * PURPOSE
 *   Bootstraps the first admin account on a fresh database. Idempotent.
 *
 * WHAT TO WRITE
 *   - Read SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (+ names) from env; refuse to run if missing
 *     or if the password is shorter than the login schema allows.
 *   - Reuse the real adapters: loadEnv(), createDatabase(), PgUserRepository, PasswordHasher.
 *   - If findByEmail(email) exists -> log "already exists" and exit 0.
 *   - Else create({ email, passwordHash: await hasher.hash(password), roleName: ROLES.ADMIN, ... }).
 *   - Never print the password. Disconnect the database before exiting.
 */
export {};
