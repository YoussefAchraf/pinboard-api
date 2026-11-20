/**
 * FILE:   src/infrastructure/database/prismaClient.ts
 * LAYER:  infrastructure (adapters; no express / socket.io, no process.env)
 * STATUS: implemented (task 001)
 *
 * PURPOSE
 *   Creates THE Prisma client (one per process) on top of a pg Pool via the Prisma 7
 *   driver adapter (`new PrismaPg(poolConfig)`, verified against @prisma/adapter-pg 7.10.1 d.ts),
 *   and exposes what the composition root needs for readiness and shutdown.
 *
 * EXPORTS
 *   function createDatabase(config: { url; poolMax? }): IDatabase
 *   interface IDatabase { prisma; probe ('postgres', SELECT 1); disconnect() }
 *
 * USED BY
 *   src/app.ts (once), src/server.ts (shutdown), src/modules/healthModule.ts (probe),
 *   future Pg*Repository / PrismaUnitOfWork (receive `database.prisma`)
 *
 * MAY IMPORT
 *   ../../generated/prisma/*, @prisma/adapter-pg, domain/interfaces (types).
 */
import { PrismaPg } from '@prisma/adapter-pg';
import type { IReadinessProbe } from '../../domain/interfaces/IReadinessProbe';
import { PrismaClient } from '../../generated/prisma/client';

export interface IDatabase {
  prisma: PrismaClient;
  probe: IReadinessProbe;
  disconnect(): Promise<void>;
}

export function createDatabase(config: { url: string; poolMax?: number }): IDatabase {
  const adapter = new PrismaPg({ connectionString: config.url, max: config.poolMax });
  const prisma = new PrismaClient({ adapter });

  return {
    prisma,
    probe: {
      name: 'postgres',
      check: async (): Promise<void> => {
        await prisma.$queryRaw`SELECT 1`;
      },
    },
    disconnect: () => prisma.$disconnect(),
  };
}
