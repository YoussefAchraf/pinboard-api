/**
 * FILE:   src/interface/controllers/AuthController.ts
 * LAYER:  interface (HTTP delivery; may import express; never prisma / ioredis / process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Translates HTTP <-> auth use cases. Owns COOKIES (they are HTTP), nothing else.
 *   No business rules here - every decision lives in the use case.
 *
 * WHAT TO WRITE
 *   export interface IAuthControllerDependencies {
 *     loginUseCase: LoginUseCase; refreshSessionUseCase: RefreshSessionUseCase;
 *     logoutUseCase: LogoutUseCase; getCurrentUserUseCase: GetCurrentUserUseCase;
 *     cookieOptions: { secure: boolean; domain: string; accessMaxAgeMs: number; refreshMaxAgeMs: number };
 *     generateCsrfToken: () => string;
 *   }
 *   export class AuthController {
 *     constructor(private readonly _deps: IAuthControllerDependencies) {}
 *     login   = async (req, res): Promise<void>  -> execute(req.body) -> _setSessionCookies(res, tokens)
 *                                                  -> res.status(200).json({ user: presentUser(user) })
 *     refresh = async (req, res)  -> execute({ refreshToken: req.cookies.refreshToken }) -> set cookies -> 204
 *     logout  = async (req, res)  -> execute(...) -> _clearSessionCookies(res) -> 204
 *     show    = async (req, res)  -> execute({ userId: req.auth.userId }) -> 200 { user: presentUser(user) }
 *     private _setSessionCookies(res, tokens): accessToken (httpOnly, sameSite 'lax', path '/'),
 *        refreshToken (httpOnly, sameSite 'strict', path '/v1/auth'), csrfToken (NOT httpOnly - the
 *        frontend reads it), all with secure/domain from cookieOptions.
 *   - Methods are arrow-function properties so they can be passed to the router unbound.
 *   - Express 5 forwards rejected promises to the error handler - no try/catch needed.
 *   - Method names = intent (login, refresh, logout, show) - never HTTP verbs (lint).
 *
 * EXPORTS
 *   class AuthController, interface IAuthControllerDependencies
 *
 * USED BY
 *   src/modules/authModule.ts               `new AuthController({ loginUseCase, ... })`
 *   interface/routes/authRoutes.ts          `router.post('/login', loginLimiter, validate(loginSchema), controller.login)`
 *
 * MAY IMPORT
 *   express (types), use-cases/auth/*, ../presenters/UserPresenter, domain/** (types).
 */
export {};
