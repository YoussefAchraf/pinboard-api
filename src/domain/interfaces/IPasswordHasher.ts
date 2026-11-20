/**
 * FILE:   src/domain/interfaces/IPasswordHasher.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Password hashing port, so use cases never import bcrypt.
 *
 * WHAT TO WRITE
 *   export interface IPasswordHasher {
 *     hash(plain: string): Promise<string>;
 *     verify(plain: string, hash: string): Promise<boolean>;   // constant-time compare
 *   }
 *
 * EXPORTS
 *   interface IPasswordHasher
 *
 * USED BY
 *   infrastructure/security/PasswordHasher.ts   `implements IPasswordHasher` (bcrypt)
 *   use-cases/auth/LoginUseCase.ts              verify on login
 *   scripts/seedAdmin.ts                        hash the first admin password
 *
 * MAY IMPORT
 *   Nothing.
 */
export {};
