/**
 * FILE:   src/infrastructure/database/prismaClient.ts
 * LAYER:  infrastructure (adapters; no express / socket.io, no process.env)
 * STATUS: placeholder - implement in place; keep this header in sync with the real code.
 *
 * PURPOSE
 *   Creates THE Prisma client (one per process) on top of a pg Pool via the Prisma 7
 *   driver adapter, and exposes what the composition root needs for readiness and shutdown.
 *
 * WHAT TO WRITE
 *   export interface IDatabase {
 *     prisma: PrismaClient;          // from '../../generated/prisma/client' (generated, never edited)
 *     probe: IReadinessProbe;        // name 'postgres', check = prisma.$queryRaw`SELECT 1`
 *     disconnect(): Promise<void>;   // prisma.$disconnect() (closes the adapter pool)
 *   }
 *   export function createDatabase(config: { url: string; poolMax?: number }): IDatabase
 *     - new PrismaPg({ connectionString: config.url, max: config.poolMax })   (@prisma/adapter-pg)
 *     - new PrismaClient({ adapter })
 *     - log slow queries in development through the injected ILogger if needed.
 *   Verify the exact @prisma/adapter-pg constructor options against the pinned version.
 *
 * EXPORTS
 *   function createDatabase, interface IDatabase
 *
 * USED BY
 *   src/app.ts      `const database = createDatabase({ url: config.database.url })` (once)
 *   src/server.ts   shutdown: `await database.disconnect()` after the HTTP server closes
 *   infrastructure/repositories/Pg*Repository.ts  receive `database.prisma` by constructor
 *   infrastructure/database/PrismaUnitOfWork.ts   receives `database.prisma`
 *   src/modules/healthModule.ts                   receives `database.probe`
 *
 * MAY IMPORT
 *   ../../generated/prisma/*, @prisma/adapter-pg, domain/interfaces (types).
 */
export {};
