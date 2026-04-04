
const { PrismaClient } = require('./src/generated/client_new');
const prisma = new PrismaClient();

async function main() {
    try {
        const events = await prisma.event.findMany();
        console.log('--- EVENTS IN DB ---');
        events.forEach(e => {
            console.log(`- ${e.eventName} (ID: ${e.id})`);
        });
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
