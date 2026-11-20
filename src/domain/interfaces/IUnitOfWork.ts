/**
 * FILE:   src/domain/interfaces/IUnitOfWork.ts
 * LAYER:  domain (pure - no framework imports, no process.env, no console)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Transaction port. Lets a use case write through SEVERAL repositories atomically
 *   without importing Prisma. Single-repository writes don't need it.
 *
 * WHAT TO WRITE
 *   export interface ITransactionScope {
 *     users: IUserRepository;
 *     // add one property per repository that may take part in a transaction
 *   }
 *   export interface IUnitOfWork {
 *     run<T>(work: (scope: ITransactionScope) => Promise<T>): Promise<T>;
 *   }
 *   Rules:
 *     - everything inside `work` commits together or rolls back together;
 *     - no external I/O (email, HTTP, Redis) inside `work` - do it after `run` resolves;
 *     - keep transactions short (bounded timeout in the implementation).
 *
 * EXPORTS
 *   interface IUnitOfWork, interface ITransactionScope
 *
 * USED BY
 *   use-cases/** that mutate more than one aggregate:
 *     await this._deps.unitOfWork.run(async ({ users }) => { ... });
 *   infrastructure/database/PrismaUnitOfWork.ts   `implements IUnitOfWork`
 *   src/modules/*Module.ts                        injects the shared instance into use cases
 *
 * MAY IMPORT
 *   ./I*Repository (types only).
 */
export {};
