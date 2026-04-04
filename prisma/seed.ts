
const { PrismaClient } = require('../src/generated/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DATABASE SEEDING PROTECTION ---');
    console.log('Seeding process skipped to protect your production data.');
    console.log('Use the Admin Panel to manage Themes and Bundles.');
    console.log('------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
