import { PrismaClient } from '../generated/client';
import fs from 'fs';
import path from 'path';

// Manual .env loading fallback for workspace root issues
if (!process.env.DATABASE_URL) {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
                    if (!process.env[key.trim()]) {
                        process.env[key.trim()] = value;
                    }
                }
            });
            console.log("Prisma Init: Manually loaded .env from", envPath);
        }
    } catch (err) {
        console.error("Prisma Init: Failed to manually load .env", err);
    }
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

console.log("Prisma Init: DATABASE_URL exists:", !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    console.log("Prisma Init: URL Length:", url.length);
    console.log("Prisma Init: URL Start (masked):", url.substring(0, 15) + "...");
    console.log("Prisma Init: URL End (masked):", "..." + url.substring(url.length - 15));
} else {
    console.error("Prisma Init Error: DATABASE_URL is UNDEFINED.");
}


export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        log: ['query', 'info', 'warn', 'error'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const getPrisma = () => prisma;

