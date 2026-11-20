/**
 * FILE:   src/use-cases/auth/GetCurrentUserUseCase.ts
 * LAYER:  use-cases (no express / prisma / ioredis / socket.io, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 * KIND:   query (read-only)
 *
 * PURPOSE
 *   GET /v1/auth/whoami -> return the authenticated user. The frontend calls it on boot
 *   (session bootstrap) to know whether a session exists.
 *
 * WHAT TO WRITE
 *   export interface IGetCurrentUserInput { userId: string }   // from req.auth (set by authMiddleware)
 *   export interface IGetCurrentUserDependencies { userRepository: IUserRepository }
 *   export class GetCurrentUserUseCase { execute(input): Promise<User> }
 *   Steps: user = findById(userId); if !user or !user.canLogin() -> throw UNAUTHENTICATED.
 *
 * EXPORTS
 *   class GetCurrentUserUseCase + its Input/Dependencies interfaces
 *
 * USED BY
 *   src/modules/authModule.ts               instantiation
 *   interface/controllers/AuthController.ts `show` method -> presentUser(user)
 *
 * MAY IMPORT
 *   domain/** only.
 */
export {};
