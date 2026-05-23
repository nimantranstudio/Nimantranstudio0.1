
const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function check() {
  const themes = await prisma.theme.findMany();
  const bundles = await prisma.bundle.findMany();
  console.log('Themes:', themes.length);
  console.log('Bundles:', bundles.length);
  await prisma.$disconnect();
}
check();
