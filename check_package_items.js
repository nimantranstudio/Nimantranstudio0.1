
const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const pkg = await prisma.package.findFirst({
            where: { name: "Complete Wedding Suite" }
        });
        if (pkg) {
            console.log("Allowed Items for Complete Wedding Suite:");
            console.log(pkg.allowedItems);
        } else {
            console.log("Package 'Complete Wedding Suite' not found.");
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
