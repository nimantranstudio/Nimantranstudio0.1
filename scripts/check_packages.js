
const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function check() {
  const pkgs = await prisma.package.findMany();
  console.log('Packages:', pkgs.length);
  console.log(JSON.stringify(pkgs, null, 2));
  await prisma.$disconnect();
}
check();
