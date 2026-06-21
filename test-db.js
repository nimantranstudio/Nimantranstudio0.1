const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const themes = await prisma.theme.findMany();
    console.log("Themes count:", themes.length);
    if (themes.length > 0) {
      console.log("First theme:", themes[0]);
    }
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
