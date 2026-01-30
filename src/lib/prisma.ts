// Force rebuild
import { PrismaClient } from '../generated/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        log:
            process.env.NODE_ENV === 'production'
                ? ['warn', 'error']
                : ['query', 'info', 'warn', 'error'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const getPrisma = () => prisma;
