import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';
import { WeddingFormSchema } from '@/lib/schemas/wedding-form';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = WeddingFormSchema.parse(body.formData);
        const { selectedThemeId, userId } = body;

        // For now, if no userId is provided, we use a placeholder or create a guest user
        // In a real app, this would come from the auth session
        const finalUserId = userId || await getOrCreateGuestUser();

        const wedding = await prisma.wedding.create({
            data: {
                ownerId: finalUserId,
                themeId: selectedThemeId,
                groomName: validatedData.groomName,
                brideName: validatedData.brideName,
                groomParents: validatedData.groomParents,
                brideParents: validatedData.brideParents,
                rsvpContact: validatedData.rsvpContact,
                rsvpDeadline: validatedData.rsvpDeadline ? new Date(validatedData.rsvpDeadline) : null,
                invitationMessage: validatedData.invitationMessage,
                events: {
                    create: validatedData.events.map(event => ({
                        name: event.name,
                        date: event.date,
                        time: event.time,
                        venue: event.venue,
                        mapLink: event.mapLink,
                        description: event.description,
                    }))
                }
            },
            include: {
                events: true
            }
        });

        return NextResponse.json({ success: true, wedding });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            const issues = error.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ');
            return NextResponse.json({ success: false, error: `Validation failed: ${issues}` }, { status: 400 });
        }

        console.error('Error creating wedding:', error);

        // Handle common Prisma or connection errors
        let userMessage = error.message;
        if (error.message.includes('Prisma') || error.message.includes('Can\'t reach database')) {
            userMessage = "Database connection issue. Please ensure your database is running.";
        }

        return NextResponse.json({ success: false, error: userMessage }, { status: 500 });
    }
}

async function getOrCreateGuestUser() {
    const guestEmail = 'guest@nimantranstudio.com';
    let user = await prisma.user.findUnique({ where: { email: guestEmail } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: guestEmail,
                name: 'Guest User'
            }
        });
    }
    return user.id;
}
