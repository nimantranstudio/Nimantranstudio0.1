
const { PrismaClient } = require('@prisma/client');

async function main() {
    // Explicitly pass options to satisfy the constructor requirement
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: "postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
            },
        },
    });

    try {
        console.log("Connecting...");
        const events = await prisma.event.findMany({
            include: { wedding: true }
        });

        if (events.length === 0) {
            console.log("Result: No events found.");
        } else {
            console.log(`Found ${events.length} events:`);
            events.forEach(e => {
                console.log(`>> Event ID: ${e.id}`);
                console.log(`   Name: ${e.name}`);
                console.log(`   Test URL: http://localhost:3000/rsvp/${e.id}`);
            });
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
