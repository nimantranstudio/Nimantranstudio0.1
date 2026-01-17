import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
    // Only initialize adapter on the server side
    if (typeof window !== 'undefined') return null as any;

    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        console.warn("DATABASE_URL is not defined. Prisma may fail to connect.");
        return new PrismaClient();
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Lazy getter for Prisma instance
const getPrisma = () => {
    if (typeof window !== 'undefined') return null as any;

    if (!(globalThis as any).prisma) {
        (globalThis as any).prisma = prismaClientSingleton();
    }
    return (globalThis as any).prisma;
}

// Proxy to handle lazy access
const prisma = new Proxy({} as PrismaClient, {
    get: (target, prop) => {
        const instance = getPrisma();
        if (!instance) return undefined;
        return (instance as any)[prop];
    }
});

export default prisma
