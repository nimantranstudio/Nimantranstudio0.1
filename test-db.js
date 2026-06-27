const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const themes = await prisma.theme.findMany({
      include: {
        bundles: {
          include: {
            bundleItems: true
          }
        }
      }
    });
    console.log("Found themes:", themes.length);
    for (const t of themes) {
      console.log(`Theme: ${t.name} (ID: ${t.id})`);
      console.log("  Thumbnail:", t.thumbnailUrl);
      console.log("  Preview Images:", t.previewImages);
      if (t.bundles) {
        for (const b of t.bundles) {
          console.log(`  Bundle: ${b.BundleName} (ID: ${b.id})`);
          if (b.bundleItems) {
            for (const bi of b.bundleItems) {
              console.log(`    Item: ${bi.templateName} (${bi.eventId}) -> Path: ${bi.templatePath}`);
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
