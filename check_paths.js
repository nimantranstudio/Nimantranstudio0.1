const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bundles = await prisma.bundle.findMany({
        include: {
            bundleItems: true
        }
    });

    console.log(JSON.stringify(bundles, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
