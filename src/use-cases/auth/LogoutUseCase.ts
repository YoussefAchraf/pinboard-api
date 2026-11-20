/**
 * FILE:   src/use-cases/auth/LogoutUseCase.ts
 * LAYER:  use-cases (no express / prisma / ioredis / socket.io, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 * KIND:   command (revokes a refresh session)
 *
 * PURPOSE
 *   POST /v1/auth/logout -> revoke the current refresh session. Idempotent: logging out
 *   with a missing/invalid token still succeeds (the controller clears cookies anyway).
 *
 * WHAT TO WRITE
 *   export interface ILogoutInput { refreshToken?: string }
 *   export interface ILogoutDependencies { tokenService: ITokenService; refreshTokenStore: IRefreshTokenStore }
 *   export class LogoutUseCase { execute(input: ILogoutInput): Promise<void> }
 *   Steps: if token present and verifyRefresh succeeds -> revokeSession(payload.sessionId).
 *          Swallow UNAUTHENTICATED here (logout must not fail on an expired token).
 *
 * EXPORTS
 *   class LogoutUseCase + its Input/Dependencies interfaces
 *
 * USED BY
 *   src/modules/authModule.ts               instantiation
 *   interface/controllers/AuthController.ts `logout` method (then clears cookies, 204)
 *
 * MAY IMPORT
 *   domain/** only.
 */
export {};
