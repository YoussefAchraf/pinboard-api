/**
 * FILE:   src/infrastructure/security/RefreshTokenStore.ts
 * LAYER:  infrastructure (adapters; no express / socket.io, no process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Redis implementation of IRefreshTokenStore (hashed tokens, TTL = refresh TTL).
 *
 * WHAT TO WRITE
 *   export class RefreshTokenStore implements IRefreshTokenStore {
 *     constructor(private readonly _redis: RedisClient) {}
 *     Keys:
 *       auth:refresh:<sessionId>        -> JSON { userId, tokenHash }   (EX = seconds until expiresAt)
 *       auth:user-sessions:<userId>     -> SET of sessionIds            (for revokeAllForUser)
 *     save            -> SET with EX + SADD
 *     rotate          -> ATOMIC compare-and-swap: a small Lua script via RedisClient.raw.eval
 *                        (if stored hash == current then set next + new EX, return 1 else 0)
 *     revokeSession   -> DEL key + SREM
 *     revokeAllForUser-> SMEMBERS -> DEL each -> DEL set
 *   }
 *   - Never store raw tokens. Never log token values.
 *
 * EXPORTS
 *   class RefreshTokenStore
 *
 * USED BY
 *   src/app.ts   `new RefreshTokenStore(redis)` (shared instance)
 *   src/modules/authModule.ts -> Login / RefreshSession / Logout use cases
 *
 * MAY IMPORT
 *   ../cache/RedisClient, domain/interfaces (types).
 */
export {};
