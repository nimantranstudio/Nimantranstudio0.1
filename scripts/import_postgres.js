const { PrismaClient } = require('../src/generated/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importData() {
    console.log('Starting data import into PostgreSQL...');

    try {
        const filePath = path.join(__dirname, 'mssql_export.json');
        if (!fs.existsSync(filePath)) {
            throw new Error(`Dump file not found at ${filePath}`);
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // To prevent ID conflicts and constraint issues, we'll insert in correct order.
        // Use createMany to insert fast.

        // 1. Independent entities
        console.log(`Inserting ${data.users.length} Users...`);
        if (data.users.length) {
            await prisma.user.createMany({ data: data.users, skipDuplicates: true });
        }

        console.log(`Inserting ${data.themes.length} Themes...`);
        if (data.themes.length) {
            await prisma.theme.createMany({ data: data.themes, skipDuplicates: true });
        }

        console.log(`Inserting ${data.packages.length} Packages...`);
        if (data.packages.length) {
            await prisma.package.createMany({ data: data.packages, skipDuplicates: true });
        }

        console.log(`Inserting ${data.otpRequests.length} OTP requests...`);
        if (data.otpRequests.length) {
            await prisma.oTPRequest.createMany({ data: data.otpRequests, skipDuplicates: true });
        }

        // 2. Dependents level 1
        console.log(`Inserting ${data.bundles.length} Bundles...`);
        if (data.bundles.length) {
            await prisma.bundle.createMany({ data: data.bundles, skipDuplicates: true });
        }

        console.log(`Inserting ${data.weddings.length} Weddings...`);
        if (data.weddings.length) {
            await prisma.wedding.createMany({ data: data.weddings, skipDuplicates: true });
        }

        // 3. Dependents level 2
        console.log(`Inserting ${data.events.length} Events...`);
        if (data.events.length) {
            // Prisma createMany on postgres doesn't complain about booleans or string dates if they match schema
            await prisma.event.createMany({ data: data.events, skipDuplicates: true });
        }

        console.log(`Inserting ${data.rsvps.length} RSVPs...`);
        if (data.rsvps.length) {
            await prisma.rSVP.createMany({ data: data.rsvps, skipDuplicates: true });
        }

        console.log(`Inserting ${data.orders.length} Orders...`);
        if (data.orders.length) {
            await prisma.order.createMany({ data: data.orders, skipDuplicates: true });
        }


        console.log('Successfully completed data migration to PostgreSQL!');

    } catch (err) {
        console.error('Error importing data:', err);
    } finally {
        await prisma.$disconnect();
    }
}

importData();
