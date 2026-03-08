const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportData() {
    console.log('Starting data export from MSSQL using raw queries...');

    try {
        const data = {
            users: await prisma.$queryRawUnsafe('SELECT * FROM [User]'),
            otpRequests: await prisma.$queryRawUnsafe('SELECT * FROM [OTPRequest]'),
            themes: await prisma.$queryRawUnsafe('SELECT * FROM [Theme]'),
            bundles: await prisma.$queryRawUnsafe('SELECT * FROM [Bundle]'),
            weddings: await prisma.$queryRawUnsafe('SELECT * FROM [Wedding]'),
            events: await prisma.$queryRawUnsafe('SELECT * FROM [Event]'),
            rsvps: await prisma.$queryRawUnsafe('SELECT * FROM [RSVP]'),
            orders: await prisma.$queryRawUnsafe('SELECT * FROM [Order]'),
            packages: await prisma.$queryRawUnsafe('SELECT * FROM [Package]'),
        };

        const filePath = path.join(__dirname, 'mssql_export.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        console.log(`Successfully exported data to ${filePath}`);
        console.log(`Exported records:
      Users: ${data.users.length}
      OTP Requests: ${data.otpRequests.length}
      Themes: ${data.themes.length}
      Bundles: ${data.bundles.length}
      Weddings: ${data.weddings.length}
      Events: ${data.events.length}
      RSVPs: ${data.rsvps.length}
      Orders: ${data.orders.length}
      Packages: ${data.packages.length}
    `);
    } catch (err) {
        console.error('Error exporting data:', err);
    } finally {
        await prisma.$disconnect();
    }
}

exportData();
