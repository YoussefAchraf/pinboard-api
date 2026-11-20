/**
 * FILE:   src/domain/interfaces/ITokenService.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Port for issuing and verifying access/refresh tokens, so use cases never import
 *   jsonwebtoken. Cookie handling is NOT here (that is HTTP -> AuthController).
 *
 * WHAT TO WRITE
 *   export interface IAccessTokenPayload { sub: string; role: Role }
 *   export interface IRefreshTokenPayload { sub: string; sessionId: string }   // sessionId = refresh-token family id
 *   export interface ITokenPair { accessToken: string; refreshToken: string; refreshExpiresAt: Date }
 *   export interface ITokenService {
 *     issuePair(payload: { userId: string; role: Role; sessionId: string }): ITokenPair;
 *     verifyAccess(token: string): IAccessTokenPayload;     // throws AppError(UNAUTHENTICATED)
 *     verifyRefresh(token: string): IRefreshTokenPayload;   // throws AppError(UNAUTHENTICATED)
 *   }
 *
 * EXPORTS
 *   interface ITokenService, IAccessTokenPayload, IRefreshTokenPayload, ITokenPair
 *
 * USED BY
 *   infrastructure/security/TokenService.ts      `implements ITokenService`
 *   use-cases/auth/LoginUseCase.ts               issuePair after credentials check
 *   use-cases/auth/RefreshSessionUseCase.ts      verifyRefresh + issuePair (rotation)
 *   interface/middlewares/authMiddleware.ts      verifyAccess on every protected request
 *
 * MAY IMPORT
 *   ../constants/roles (type only).
 */
export {};
