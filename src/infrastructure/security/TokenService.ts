/**
 * FILE:   src/infrastructure/security/TokenService.ts
 * LAYER:  infrastructure (adapters; no express / socket.io, no process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   jsonwebtoken implementation of ITokenService (access + refresh JWTs).
 *
 * WHAT TO WRITE
 *   export interface ITokenServiceConfig { accessSecret: string; refreshSecret: string; accessTtl: string; refreshTtl: string }
 *   export class TokenService implements ITokenService {
 *     constructor(private readonly _config: ITokenServiceConfig) {}   // secrets + TTLs injected - never process.env
 *     issuePair({ userId, role, sessionId }) -> {
 *       accessToken:  jwt.sign({ sub: userId, role }, accessSecret, { expiresIn: accessTtl, algorithm: 'HS256' }),
 *       refreshToken: jwt.sign({ sub: userId, sid: sessionId }, refreshSecret, { expiresIn: refreshTtl, algorithm: 'HS256' }),
 *       refreshExpiresAt: <computed from refreshTtl>,
 *     }
 *     verifyAccess(token)  -> jwt.verify(token, accessSecret, { algorithms: ['HS256'] }); map payload;
 *                             any failure -> throw AppError(ERROR_CODES.UNAUTHENTICATED, ..., 401)
 *     verifyRefresh(token) -> same with refreshSecret, returning { sub, sessionId: payload.sid }
 *   }
 *   - Always pin `algorithms` on verify. Separate secrets for access vs refresh.
 *
 * EXPORTS
 *   class TokenService, interface ITokenServiceConfig
 *
 * USED BY
 *   src/app.ts   `new TokenService(config.jwt)` (shared instance; IEnv['jwt'] matches ITokenServiceConfig)
 *   src/modules/authModule.ts -> LoginUseCase, RefreshSessionUseCase, LogoutUseCase, authMiddleware
 *
 * MAY IMPORT
 *   jsonwebtoken, domain/** (interfaces, errors). NOT src/config (boundaries: infrastructure
 *   never imports config - config values arrive as constructor parameters).
 */
export {};
