import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const theme = await prisma.theme.findFirst({
        where: { id: 'cmnkf7nv40000g2h3gyu2r9uq' },
        include: {
            bundles: {
                include: {
                    bundleItems: {
                        include: { event: true }
                    }
                }
            }
        }
    });
    console.log(JSON.stringify(theme?.bundles[0]?.bundleItems, null, 2));
}

main().finally(() => prisma.$disconnect());
