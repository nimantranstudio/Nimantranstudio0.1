const { PrismaClient } = require('./src/generated/client_new');
const prisma = new PrismaClient();

async function main() {
  const bundles = await prisma.bundle.findMany({
    select: {
      id: true,
      BundleName: true,
      thumbnailUrl: true,
      itemImages: true
    }
  });
  console.log(JSON.stringify(bundles, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
