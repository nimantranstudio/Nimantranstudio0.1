
const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

const themes = [
    {
        name: "Royal Maratha",
        description: "Traditional Marathi wedding theme with royal elements",
        thumbnailUrl: "/theme-marathas.png",
        previewImages: JSON.stringify(["/theme-marathas.png", "/bundle-preview.png"]),
        colors: JSON.stringify(["#D4AF37", "#800000"]),
        isActive: true,
        isBestSeller: true
    },
    {
        name: "Floral Elegance",
        description: "Modern floral design for elegant weddings",
        thumbnailUrl: "/theme-floral.png",
        previewImages: JSON.stringify(["/theme-floral.png", "/bundle-preview.png"]),
        colors: JSON.stringify(["#FFC0CB", "#FFFFFF", "#4A90E2"]),
        isActive: true,
        isPopular: true
    },
    {
        name: "Golden Heritage",
        description: "Classic golden theme celebrating heritage",
        thumbnailUrl: "/theme-gold.png",
        previewImages: JSON.stringify(["/theme-gold.png", "/bundle-preview.png"]),
        colors: JSON.stringify(["#FFD700", "#000000", "#C5A065"]),
        isActive: true
    }
];

async function main() {
    try {
        console.log('Cleaning up existing bundles and themes...');
        await prisma.bundle.deleteMany({});
        await prisma.theme.deleteMany({});

        console.log('Seeding themes with colors...');
        for (const theme of themes) {
            const createdTheme = await prisma.theme.create({
                data: {
                    name: theme.name,
                    description: theme.description,
                    thumbnailUrl: theme.thumbnailUrl,
                    previewImages: theme.previewImages,
                    colors: theme.colors,
                    isActive: theme.isActive,
                    isBestSeller: theme.isBestSeller || false,
                    isPopular: theme.isPopular || false,
                    bundles: {
                        create: {
                            name: `${theme.name} Bundle`,
                            whatsappPrice: 499,
                            printablePrice: 799,
                            completePrice: 1200,
                            description: `Complete bundle for ${theme.name}`,
                            isActive: true,
                            isPopular: theme.isPopular || false
                        }
                    }
                }
            });
            console.log(`Created theme: ${createdTheme.name}`);
        }

        console.log('Seeding packages...');
        const packages = [
            {
                name: "WhatsApp Essentials",
                price: 499,
                level: 1,
                allowedItems: JSON.stringify([
                    "Save the date",
                    "Wedding Invitation",
                    "Haldi Invitation",
                    "Sangeet Invitation",
                    "Mehendi Invitation",
                    "Video",
                    "RSVP",
                    "Thank You Card"
                ]),
                whatYouGet: "Essential digital invites for WhatsApp sharing.",
                productHighlights: "HD Quality, Instant Download"
            },
            {
                name: "WhatsApp + Posters",
                price: 799,
                level: 2,
                allowedItems: JSON.stringify([
                    "Save the date",
                    "Wedding Invitation",
                    "Haldi Invitation",
                    "Sangeet Invitation",
                    "Mehendi Invitation",
                    "Video",
                    "RSVP",
                    "Reception",
                    "Welcome Wedding Poster",
                    "Welcome Haldi Poster",
                    "Thank You Card"
                ]),
                whatYouGet: "Digital invites plus printable event posters.",
                productHighlights: "Print-ready files included"
            },
            {
                name: "Complete Wedding Suite",
                price: 1200,
                level: 3,
                allowedItems: JSON.stringify([
                    "Initials logo",
                    "Wedding contract",
                    "Do not disturb",
                    "Ladke wale tag",
                    "Ladki wale tag",
                    "Save the date",
                    "Wedding Invitation",
                    "Haldi Invitation",
                    "Sangeet Invitation",
                    "Mehendi Invitation",
                    "Video",
                    "RSVP",
                    "Reception",
                    "Welcome Wedding Poster",
                    "Welcome Haldi Poster",
                    "Welcome Mehendi Poster",
                    "Thank you"
                ]),
                whatYouGet: "Full suite of digital and printable assets.",
                productHighlights: "All-in-one wedding solution"
            }
        ];

        for (const pkg of packages) {
            await prisma.package.create({
                data: pkg
            });
            console.log(`Created package: ${pkg.name}`);
        }
        console.log('Seeding complete.');
    } catch (e) {
        console.error('Error seeding themes:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
