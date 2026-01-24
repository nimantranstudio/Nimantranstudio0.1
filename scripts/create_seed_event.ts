
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding test event...');

    // Create a wedding (required parent)
    const wedding = await prisma.wedding.create({
        data: {
            ownerId: 'test-user-1',
            groomName: 'Rahul',
            brideName: 'Anjalee',
            groomParents: 'Mr. & Mrs. Sharma',
            brideParents: 'Mr. & Mrs. Gupta',
            invitationMessage: 'We invite you to celebrate our love.',
            events: {
                create: [
                    {
                        name: 'Wedding Ceremony',
                        date: '2026-02-14',
                        time: '10:00 AM',
                        venue: 'Grand Palace, Mumbai',
                        description: 'The moment we tie the knot!',
                        eventType: 'Wedding',
                        collectDietary: true,
                        allowCompanions: true
                    }
                ]
            }
        },
        include: {
            events: true
        }
    });

    const event = wedding.events[0];
    console.log('--------------------------------------------------');
    console.log('SUCCESS! Test Event Created.');
    console.log(`Event ID: ${event.id}`);
    console.log(`Test Link: http://localhost:3000/rsvp/${event.id}`);
    console.log('--------------------------------------------------');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
