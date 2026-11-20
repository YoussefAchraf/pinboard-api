/**
 * FILE:   src/use-cases/auth/LoginUseCase.ts
 * LAYER:  use-cases (no express / prisma / ioredis / socket.io, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 * KIND:   command (changes state: creates a refresh session)
 *
 * PURPOSE
 *   POST /v1/auth/login -> verify credentials, open a refresh session, return tokens + user.
 *   Contract: contracts/openapi/auth.yaml (written by the manager before implementation).
 *
 * WHAT TO WRITE
 *   export interface ILoginInput  { email: string; password: string }
 *   export interface ILoginResult { user: User; tokens: ITokenPair }
 *   export interface ILoginDependencies {
 *     userRepository: IUserRepository;
 *     passwordHasher: IPasswordHasher;
 *     tokenService: ITokenService;
 *     refreshTokenStore: IRefreshTokenStore;
 *     idGenerator: () => string;           // sessionId (crypto.randomUUID injected by the module)
 *     hashToken: (token: string) => string; // sha256 hex, injected by the module
 *   }
 *   export class LoginUseCase {
 *     constructor(private readonly _deps: ILoginDependencies) {}
 *     async execute(input: ILoginInput): Promise<ILoginResult>
 *   }
 *   Steps in execute():
 *     1. user = findByEmail(normalized email)
 *     2. if !user OR !verify(password, user.passwordHash) -> throw INVALID_CREDENTIALS (401).
 *        Same error + similar timing for both cases (no user enumeration).
 *     3. if !user.canLogin() -> throw FORBIDDEN (403)
 *     4. sessionId = idGenerator(); tokens = tokenService.issuePair({ userId, role, sessionId })
 *     5. refreshTokenStore.save(sessionId, user.id, hashToken(tokens.refreshToken), tokens.refreshExpiresAt)
 *     6. return { user, tokens }   // the CONTROLLER sets cookies, the PRESENTER shapes `user`
 *
 * EXPORTS
 *   class LoginUseCase, interfaces ILoginInput, ILoginResult, ILoginDependencies
 *
 * USED BY
 *   src/modules/authModule.ts              `new LoginUseCase({ userRepository, passwordHasher, ... })`
 *   interface/controllers/AuthController.ts `await this._deps.loginUseCase.execute(req.body)`
 *   tests/unit/LoginUseCase.test.ts         in-memory doubles for every dependency
 *
 * MAY IMPORT
 *   domain/** only (entities, interfaces, errors, constants).
 */
export {};
