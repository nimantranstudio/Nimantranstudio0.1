
const { PrismaClient } = require('@prisma/client');

// Manually set the env var for this script execution since we aren't using dotenv
process.env.DATABASE_URL = "postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public";

async function main() {
    const prisma = new PrismaClient(); // No args, rely on env var

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
                console.log(`   Link: http://localhost:3000/rsvp/${e.id}`);
            });
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
