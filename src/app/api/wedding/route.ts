import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
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
        console.error('Error creating wedding:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
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
