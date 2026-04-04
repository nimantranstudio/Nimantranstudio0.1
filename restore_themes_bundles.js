
const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

const themes = [
    {
        name: "Royal Maratha",
        description: "Traditional Marathi wedding theme with royal elements",
        thumbnailUrl: "/theme-marathas.png",
        previewImages: JSON.stringify(["/theme-marathas.png", "/bundle-preview.png"]),
        isActive: true,
        isBestSeller: true
    },
    {
        name: "Floral Elegance",
        description: "Modern floral design for elegant weddings",
        thumbnailUrl: "/theme-floral.png",
        previewImages: JSON.stringify(["/theme-floral.png", "/bundle-preview.png"]),
        isActive: true,
        isPopular: true
    }
];

async function main() {
    try {
        console.log('Clearing existing test themes...');
        await prisma.theme.deleteMany({});
        await prisma.bundle.deleteMany({});

        console.log('Restoring themes and bundles...');
        for (const theme of themes) {
            const createdTheme = await prisma.theme.create({
                data: {
                    name: theme.name,
                    description: theme.description,
                    thumbnailUrl: theme.thumbnailUrl,
                    previewImages: theme.previewImages,
                    isActive: theme.isActive,
                    isBestSeller: theme.isBestSeller || false,
                    isPopular: theme.isPopular || false
                }
            });
            
            // Create a bundle for each theme
            await prisma.bundle.create({
                data: {
                    BundleName: `${theme.name} Bundle`,
                    bundleDescription: `Complete bundle for ${theme.name}`,
                    isActive: true,
                    isPopular: theme.isPopular || false,
                    themeId: createdTheme.id,
                }
            });
            console.log(`Created theme and bundle for: ${createdTheme.name}`);
        }

        console.log('Restoration complete.');
    } catch (e) {
        console.error('Error during restoration:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
