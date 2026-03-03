const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const theme = await prisma.theme.findFirst();
    console.log("previewImages:", theme.previewImages);
    try {
        if (theme.previewImages) {
            console.log("Parsed:", JSON.parse(theme.previewImages));
        }
    } catch (e) {
        console.error("JSON parse error:", e);
    }
    await prisma.$disconnect();
}
main();
