/**
 * FILE:   tests/helpers/inMemoryUserRepository.ts
 * LAYER:  tests (relaxed lint)
 * STATUS: placeholder - implement with the first use-case unit test.
 *
 * PURPOSE
 *   An in-memory IUserRepository for unit tests. It must honor the SAME semantics as
 *   PgUserRepository (null when not found, CONFLICT on duplicate email, case-insensitive
 *   email lookup) - otherwise unit tests lie (Liskov).
 *
 * WHAT TO WRITE
 *   export class InMemoryUserRepository implements IUserRepository {
 *     private readonly _users = new Map<string, User>();
 *     seed(...users: User[]): this
 *     findById / findByEmail / create / updateStatus  (same contract as the interface)
 *   }
 *   Pattern for every new repository: tests/helpers/inMemory<Thing>Repository.ts
 */
export {};
