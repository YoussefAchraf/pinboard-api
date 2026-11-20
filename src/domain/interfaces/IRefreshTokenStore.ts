/**
 * FILE:   src/domain/interfaces/IRefreshTokenStore.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Server-side record of valid refresh tokens, enabling rotation, revocation and
 *   reuse detection. Tokens are stored HASHED, never raw.
 *
 * WHAT TO WRITE
 *   export interface IRefreshTokenStore {
 *     save(sessionId: string, userId: string, tokenHash: string, expiresAt: Date): Promise<void>;
 *     // Atomically replaces the stored hash if `currentHash` matches; returns false on mismatch
 *     // (= token reuse -> caller revokes the whole session).
 *     rotate(sessionId: string, currentHash: string, nextHash: string, expiresAt: Date): Promise<boolean>;
 *     revokeSession(sessionId: string): Promise<void>;
 *     revokeAllForUser(userId: string): Promise<void>;
 *   }
 *
 * EXPORTS
 *   interface IRefreshTokenStore
 *
 * USED BY
 *   infrastructure/security/RefreshTokenStore.ts   `implements IRefreshTokenStore` (Redis, TTL = refresh TTL)
 *   use-cases/auth/LoginUseCase.ts                 save
 *   use-cases/auth/RefreshSessionUseCase.ts        rotate (+ revokeSession on reuse)
 *   use-cases/auth/LogoutUseCase.ts                revokeSession
 *
 * MAY IMPORT
 *   Nothing.
 */
export {};
