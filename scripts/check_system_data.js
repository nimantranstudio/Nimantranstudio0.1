
const { PrismaClient } = require('./src/generated/client_new');
const prisma = new PrismaClient();

async function main() {
    try {
        const pkgs = await prisma.package.findMany();
        console.log('--- PACKAGES IN DB ---');
        pkgs.forEach(p => {
            console.log(`- ${p.name}: allowedItems = ${p.allowedItems}`);
        });
        
        const themes = await prisma.theme.findMany({ include: { bundles: { include: { bundleItems: true } } } });
        console.log('\n--- DATA SUMMARY ---');
        themes.forEach(t => {
            console.log(`Theme: ${t.name} (${t.id})`);
            t.bundles.forEach(b => {
                console.log(`  Bundle: ${b.BundleName} (${b.id})`);
                b.bundleItems.forEach(i => {
                    console.log(`    Item: ID=${i.eventId} (${i.event?.eventName || 'Unknown event'}) -> ${i.templatePath}`);
                });
            });
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
