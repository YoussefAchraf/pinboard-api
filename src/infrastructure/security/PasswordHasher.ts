/**
 * FILE:   src/infrastructure/security/PasswordHasher.ts
 * LAYER:  infrastructure (adapters; no express / socket.io, no process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   bcrypt implementation of IPasswordHasher.
 *
 * WHAT TO WRITE
 *   export class PasswordHasher implements IPasswordHasher {
 *     constructor(private readonly _options: { rounds: number } = { rounds: 12 }) {}
 *     hash(plain)          -> bcrypt.hash(plain, rounds)
 *     verify(plain, hash)  -> bcrypt.compare(plain, hash)
 *   }
 *   - Keep `rounds` injectable so tests can use a low value (e.g. 4) for speed.
 *
 * EXPORTS
 *   class PasswordHasher
 *
 * USED BY
 *   src/app.ts          `new PasswordHasher()` (shared instance)
 *   scripts/seedAdmin.ts
 *
 * MAY IMPORT
 *   bcrypt, domain/interfaces/IPasswordHasher (type).
 */
export {};
