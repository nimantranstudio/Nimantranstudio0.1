const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$executeRawUnsafe('TRUNCATE TABLE "BundleInvoice" CASCADE').then(() => console.log('Done')).finally(() => prisma.$disconnect());
