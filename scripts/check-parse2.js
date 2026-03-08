const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const theme = await prisma.theme.findFirst();
    const id = theme.id;
    const res = await fetch(`http://localhost:3000/api/themes/${id}`);
    console.log("Status:", res.status);
    console.log("Response:", await res.text());
}
main();
