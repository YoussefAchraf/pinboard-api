/**
 * FILE:   src/domain/interfaces/IUserRepository.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Persistence contract for the User aggregate. Use cases depend on THIS interface,
 *   never on Prisma (Dependency Inversion). Narrow on purpose (Interface Segregation):
 *   only the methods use cases actually call.
 *
 * WHAT TO WRITE
 *   export interface IUserRepository {
 *     findById(id: string): Promise<User | null>;
 *     findByEmail(email: string): Promise<User | null>;      // case-insensitive
 *     create(input: ICreateUserInput): Promise<User>;
 *     updateStatus(id: string, status: UserStatus): Promise<User>;
 *   }
 *   export interface ICreateUserInput { email; passwordHash; firstname; lastname; roleName }
 *   Semantics every implementation MUST honor (Liskov):
 *     - not found -> return null (never throw);
 *     - unique-email violation -> throw AppError(ERROR_CODES.CONFLICT);
 *     - always return domain entities, never Prisma rows.
 *
 * EXPORTS
 *   interface IUserRepository, interface ICreateUserInput
 *
 * USED BY
 *   use-cases/auth/LoginUseCase.ts, GetCurrentUserUseCase.ts    (constructor dependency)
 *   domain/interfaces/IUnitOfWork.ts                            (ITransactionScope.users)
 *   infrastructure/repositories/PgUserRepository.ts             `implements IUserRepository`
 *   tests/unit/*.test.ts                                        in-memory double implementing it
 *
 * MAY IMPORT
 *   ../entities/User, ../constants/roles (types only).
 */
export {};
