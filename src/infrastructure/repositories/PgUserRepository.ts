/**
 * FILE:   src/infrastructure/repositories/PgUserRepository.ts
 * LAYER:  infrastructure (adapters; no express / socket.io / ioredis, no process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Postgres implementation of IUserRepository. The ONLY place that knows how users are
 *   stored. Returns domain entities, never Prisma rows.
 *
 * WHAT TO WRITE
 *   function mapRow(row: <generated User row type>): User   // module-level, not exported
 *     -> new User({ id: row.id, email: row.email, ... })
 *   export class PgUserRepository implements IUserRepository {
 *     constructor(private readonly _db: PrismaClient | <TransactionClient>) {}
 *     findById(id)          -> findUnique({ where: { id } }) -> row ? mapRow(row) : null
 *     findByEmail(email)    -> case-insensitive: findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })
 *                              (or an expression index on lower(email) + $queryRaw - measure first)
 *     create(input)         -> create(); catch the unique-violation error (Prisma code P2002)
 *                              -> throw AppError(ERROR_CODES.CONFLICT, 'Email already registered', 409)
 *     updateStatus(id, s)   -> update() -> mapRow
 *   Rules: explicit `select` on hot paths; $queryRaw only as tagged templates (parameterized);
 *          never string-interpolated SQL.
 *
 * EXPORTS
 *   class PgUserRepository
 *
 * USED BY
 *   src/app.ts                                 `new PgUserRepository(database.prisma)` (shared instance)
 *   infrastructure/database/PrismaUnitOfWork.ts `new PgUserRepository(tx)` inside a transaction
 *   tests/integration/PgUserRepository.test.ts  against real Postgres
 *
 * MAY IMPORT
 *   ../../generated/prisma/*, domain/** (entities, interfaces, errors).
 */
export {};
