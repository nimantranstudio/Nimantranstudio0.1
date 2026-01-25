const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function checkPackages() {
    try {
        const packages = await prisma.package.findMany();
        console.log('--- PACKAGES IN DB ---');
        console.log(JSON.stringify(packages, null, 2));
        console.log('----------------------');
    } catch (error) {
        console.error('Error fetching packages:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkPackages();
