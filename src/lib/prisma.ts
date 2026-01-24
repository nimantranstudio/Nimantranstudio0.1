import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const getPrisma = () => {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
            log: ['query', 'info', 'warn', 'error'],
        });
    }
    return globalForPrisma.prisma;
};

if (process.env.NODE_ENV !== 'production') {
    // Keep the instance alive in dev
}
