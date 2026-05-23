
const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Cleaning all data to prepare for schema overhaul...');
    
    // Reverse order of dependencies
    await prisma.bundleInvoice.deleteMany({});
    await prisma.packageDisplayOption.deleteMany({});
    await prisma.bundleItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.rSVP.deleteMany({});
    await prisma.event.deleteMany({}).catch(() => {}); // May not exist yet
    await prisma.wedding.deleteMany({}).catch(() => {});
    await prisma.bundle.deleteMany({});
    await prisma.package.deleteMany({});
    await prisma.theme.deleteMany({});
    await prisma.uTPRequest.deleteMany({}).catch(() => {});
    await prisma.user.deleteMany({});

    console.log('Successfully cleared database.');
  } catch (err) {
    console.error('Error clearing database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
