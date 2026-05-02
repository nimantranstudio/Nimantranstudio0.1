const { PrismaClient } = require('./src/generated/client_new');
const prisma = new PrismaClient();

async function main() {
    const items = await prisma.bundleItem.findMany({
        take: 15,
        include: {
            event: true
        }
    });
    console.log(JSON.stringify(items, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
