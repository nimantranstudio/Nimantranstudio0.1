const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const theme = await prisma.theme.findFirst({
        where: { name: 'test theme' },
        include: {
            bundles: {
                include: {
                    bundleItems: {
                        include: { event: true }
                    }
                }
            }
        }
    });

    if (!theme) {
        console.log("Theme 'test theme' not found.");
        return;
    }

    console.log("Found theme:", theme.name, "ID:", theme.id);
    theme.bundles.forEach(b => {
        console.log("  Bundle:", b.BundleName, "ID:", b.id);
        b.bundleItems.forEach(bi => {
            console.log("    Item:", bi.templateName || bi.event?.eventName, "Path:", bi.templatePath);
        });
    });
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
