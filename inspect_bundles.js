const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bundles = await prisma.bundle.findMany({
    include: {
      bundleItems: true
    }
  });
  console.log("Total bundles:", bundles.length);
  for (const b of bundles) {
    console.log(`Bundle: ${b.BundleName} (Theme ID: ${b.themeId})`);
    for (const bi of b.bundleItems) {
      console.log(`  Item: ${bi.templateName} (${bi.eventId}) -> ${bi.templatePath}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
