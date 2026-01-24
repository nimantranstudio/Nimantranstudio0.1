import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Only initialize adapter on the server side
    if (typeof window !== 'undefined') return null as any;

    return new PrismaClient();
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
