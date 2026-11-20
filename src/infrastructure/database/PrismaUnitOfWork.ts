/**
 * FILE:   src/infrastructure/database/PrismaUnitOfWork.ts
 * LAYER:  infrastructure (adapters; no express / socket.io, no process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Implements the IUnitOfWork port with an interactive Prisma transaction. Builds
 *   transaction-bound repositories so every write inside `work` uses the same tx.
 *
 * WHAT TO WRITE
 *   export class PrismaUnitOfWork implements IUnitOfWork {
 *     constructor(private readonly _prisma: PrismaClient, private readonly _options = { timeoutMs: 5000 }) {}
 *     run<T>(work: (scope: ITransactionScope) => Promise<T>): Promise<T> {
 *       return this._prisma.$transaction(
 *         (tx) => work({ users: new PgUserRepository(tx) }),   // one entry per ITransactionScope member
 *         { timeout: this._options.timeoutMs },
 *       );
 *     }
 *   }
 *   - Repositories must therefore accept either the client or a transaction client in
 *     their constructor (type: the Prisma transaction-client type of the generated client).
 *
 * EXPORTS
 *   class PrismaUnitOfWork
 *
 * USED BY
 *   src/app.ts        `const unitOfWork = new PrismaUnitOfWork(database.prisma)` (once, shared)
 *   src/modules/*     inject `unitOfWork` into use cases that need multi-aggregate writes
 *   tests/integration/PrismaUnitOfWork.test.ts  commit + rollback behavior against real Postgres
 *
 * MAY IMPORT
 *   ../../generated/prisma/*, ../repositories/*, domain/interfaces (types).
 */
export {};
