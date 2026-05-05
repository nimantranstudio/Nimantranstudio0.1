import { PrismaClient } from '../generated/client_new';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

let _prisma: PrismaClient | undefined;

function getClient(): PrismaClient {
    if (_prisma) return _prisma;
    if (globalForPrisma.prisma) {
        _prisma = globalForPrisma.prisma;
        return _prisma;
    }
    _prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
    if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _prisma;
    }
    return _prisma;
}

// Proxy-based lazy init — PrismaClient is never created at module-eval time,
// only on first actual use (i.e. inside a request handler).
export const prisma = new Proxy({} as PrismaClient, {
    get(_, prop: string | symbol) {
        const client = getClient();
        const value = Reflect.get(client, prop);
        return typeof value === 'function' ? (value as Function).bind(client) : value;
    },
});

export const getPrisma = () => getClient();
