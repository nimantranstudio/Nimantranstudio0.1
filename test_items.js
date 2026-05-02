require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
    const theme = await prisma.theme.findFirst({
        where: { id: 'cmnkf7nv40000g2h3gyu2r9uq' },
        include: { bundles: { include: { bundleItems: { include: { event: true } } } } }
    });
    console.dir(theme.bundles[0].bundleItems, { depth: null });
    await prisma.$disconnect();
}
run();
