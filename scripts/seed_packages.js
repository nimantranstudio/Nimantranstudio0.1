const { PrismaClient } = require('../src/generated/client');
const path = require('path');

const prisma = new PrismaClient();

const packages = [
    {
        name: 'WhatsApp',
        price: 999,
        level: 1,
        allowedItems: JSON.stringify([
            'Save the date',
            'Wedding Invitation',
            'Haldi Invitation',
            'Sangeet Invitation',
            'Mehendi Invitation',
            'Video',
            'RSVP',
            'Thank you'
        ]),
        isActive: true
    },
    {
        name: 'WhatsApp+ Printables',
        price: 1999,
        level: 2,
        allowedItems: JSON.stringify([
            'Save the date',
            'Wedding Invitation',
            'Haldi Invitation',
            'Sangeet Invitation',
            'Mehendi Invitation',
            'Video',
            'RSVP',
            'Reception',
            'Welcome wedding poster',
            'Welcome haldi poster',
            'Thank you'
        ]),
        isActive: true
    },
    {
        name: 'Complete suite',
        price: 3999,
        level: 3,
        allowedItems: JSON.stringify([
            'Save the date',
            'Wedding Invitation',
            'Haldi Invitation',
            'Sangeet Invitation',
            'Mehendi Invitation',
            'Video',
            'RSVP',
            'Reception',
            'Welcome wedding poster',
            'Welcome haldi poster',
            'Welcome mehendi poster',
            'Initials logo',
            'Wedding contract',
            'Do not disturb',
            'Ladke wale tag',
            'Ladki wale tag',
            'Thank you'
        ]),
        isActive: true
    }
];

async function seedPackages() {
    console.log('Starting package seeding...');

    for (const pkgData of packages) {
        const existing = await prisma.package.findFirst({
            where: { name: pkgData.name }
        });

        if (existing) {
            await prisma.package.update({
                where: { id: existing.id },
                data: pkgData
            });
            console.log(`Updated package: ${pkgData.name}`);
        } else {
            await prisma.package.create({
                data: pkgData
            });
            console.log(`Created package: ${pkgData.name}`);
        }
    }

    console.log('Package seeding completed.');
}

seedPackages()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
