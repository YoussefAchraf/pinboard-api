/**
 * FILE:   src/use-cases/auth/RefreshSessionUseCase.ts
 * LAYER:  use-cases (no express / prisma / ioredis / socket.io, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 * KIND:   command (rotates the refresh token)
 *
 * PURPOSE
 *   POST /v1/auth/refresh -> exchange a valid refresh token for a new token pair
 *   (refresh-token ROTATION with REUSE DETECTION).
 *
 * WHAT TO WRITE
 *   export interface IRefreshSessionInput  { refreshToken: string }      // read from cookie by the controller
 *   export interface IRefreshSessionResult { tokens: ITokenPair }
 *   export interface IRefreshSessionDependencies {
 *     userRepository: IUserRepository; tokenService: ITokenService;
 *     refreshTokenStore: IRefreshTokenStore; hashToken: (token: string) => string;
 *   }
 *   export class RefreshSessionUseCase { execute(input): Promise<IRefreshSessionResult> }
 *   Steps:
 *     1. payload = tokenService.verifyRefresh(refreshToken)        (throws UNAUTHENTICATED)
 *     2. user = findById(payload.sub); if !user or !user.canLogin() -> revokeSession, UNAUTHENTICATED
 *     3. tokens = issuePair({ userId, role, sessionId: payload.sessionId })
 *     4. ok = refreshTokenStore.rotate(sessionId, hash(old), hash(new), expiresAt)
 *        if !ok -> REUSE DETECTED: revokeSession(sessionId) and throw UNAUTHENTICATED
 *     5. return { tokens }
 *
 * EXPORTS
 *   class RefreshSessionUseCase + its Input/Result/Dependencies interfaces
 *
 * USED BY
 *   src/modules/authModule.ts               instantiation
 *   interface/controllers/AuthController.ts `refresh` method
 *   tests/unit/RefreshSessionUseCase.test.ts rotation + reuse-detection cases
 *
 * MAY IMPORT
 *   domain/** only.
 */
export {};
