const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function updatePackageFeatures() {
    const commonHighlights = "Premium typography, royal motifs, and culturally sensitive design elements crafted for a grand Indian wedding experience. This bundle captures the grandeur of Rajputana culture. Each element is crafted with royal precision, ensuring your wedding invitation stands out as a masterpiece.";

    const packageUpdates = [
        {
            name: "WhatsApp",
            whatYouGet: ["Everything in WhatsApp", "All 8 Wedding Event Designs (Sangeet, Haldi, etc.)"],
            highlights: commonHighlights
        },
        {
            name: "WhatsApp+ Printables",
            whatYouGet: ["Everything in WhatsApp + Printables", "All 11 Wedding Event Designs (Sangeet, Haldi, etc.)"],
            highlights: commonHighlights
        },
        {
            name: "Complete suite",
            whatYouGet: ["Everything in WhatsApp + Printables", "All 15+ Wedding Event Designs (Sangeet, Haldi, etc.)", "Complete Stationery Suite", "Source Files Included", "Dedicated Designer Support"],
            highlights: commonHighlights
        }
    ];

    try {
        for (const update of packageUpdates) {
            const pkg = await prisma.package.findFirst({
                where: { name: update.name }
            });

            if (pkg) {
                await prisma.package.update({
                    where: { id: pkg.id },
                    data: {
                        whatYouGet: JSON.stringify(update.whatYouGet),
                        productHighlights: update.highlights
                    }
                });
                console.log(`Updated package: ${update.name}`);
            } else {
                console.warn(`Package not found: ${update.name}`);
            }
        }
    } catch (error) {
        console.error("Error updating packages:", error);
    } finally {
        await prisma.$disconnect();
    }
}

updatePackageFeatures();
