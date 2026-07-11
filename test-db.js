const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bundles = await prisma.bundle.findMany({
        include: {
            bundleItems: {
                include: {
                    event: true
                }
            }
        },
        take: 1,
        orderBy: { createdDate: 'desc' }
    });
    console.log(JSON.stringify(bundles, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
