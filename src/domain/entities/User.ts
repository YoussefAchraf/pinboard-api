/**
 * FILE:   src/domain/entities/User.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   The User aggregate: identity + the business rules about a user's account state.
 *   Starter entity required by the auth contract (contracts/domain-model.md).
 *
 * WHAT TO WRITE
 *   - `interface IUserProps { id: string; email: string; passwordHash: string;
 *       firstname: string; lastname: string; roleName: Role; status: UserStatus;
 *       createdAt: Date; updatedAt: Date }`
 *   - `class User` (no suffix) with a private readonly props object and:
 *       getters for every field EXCEPT passwordHash exposure rules (keep a getter, but the
 *         presenter never maps it - see interface/presenters/UserPresenter.ts);
 *       behavior methods that encode invariants, e.g. `isActive(): boolean`,
 *         `canLogin(): boolean` (active status), `hasRole(role: Role): boolean`;
 *       a static factory `User.create(props)` that validates invariants and throws
 *         AppError(ERROR_CODES.VALIDATION_FAILED) on violation.
 *   - No persistence logic, no JSON shaping, no password hashing (that is IPasswordHasher).
 *
 * EXPORTS
 *   class User, interface IUserProps
 *
 * USED BY
 *   domain/interfaces/IUserRepository.ts          (return type of every read method)
 *   use-cases/auth/*UseCase.ts                     (business decisions: canLogin, hasRole)
 *   infrastructure/repositories/PgUserRepository.ts (mapRow -> new User(props))
 *   interface/presenters/UserPresenter.ts          (entity -> response DTO)
 *   tests/fixtures/makeUser.ts                     (object mother)
 *
 * MAY IMPORT
 *   ../constants/roles, ../errors/AppError, ../errors/errorCodes. Nothing outside domain/.
 */
export {};
