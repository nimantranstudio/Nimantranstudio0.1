import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { WeddingFormSchema } from '@/lib/schemas/wedding-form';

export async function POST(req: Request) {
    console.log("API: POST /api/wedding called");
    try {
        const body = await req.json();

        const validatedData = WeddingFormSchema.parse(body.formData);

        const { selectedThemeId, userId } = body;

        // Ensure theme exists
        if (selectedThemeId) {
            const themeExists = await prisma.theme.findUnique({ where: { id: selectedThemeId } });
            if (!themeExists) {
                return NextResponse.json({
                    success: false,
                    error: { code: 'THEME_NOT_FOUND', message: 'The selected theme could not be found in the database.' }
                }, { status: 404 });
            }
        }

        const finalUserId = userId || await getOrCreateGuestUser();

        const wedding = await prisma.wedding.create({
            data: {
                ownerId: finalUserId,
                themeId: selectedThemeId,
                groomName: validatedData.groomName || '',
                brideName: validatedData.brideName || '',
                groomParents: validatedData.groomParents || '',
                brideParents: validatedData.brideParents || '',
                rsvpContact: validatedData.rsvpContact,
                rsvpDeadline: validatedData.rsvpDeadline ? new Date(validatedData.rsvpDeadline) : null,
                invitationMessage: validatedData.invitationMessage || '',
                events: {
                    create: (validatedData.events || []).map(event => ({
                        name: event.name || 'Untitled Event',
                        date: event.date || '',
                        time: event.time || '',
                        venue: event.venue || '',
                        mapLink: event.mapLink,
                        description: event.description,
                        eventType: event.eventType,
                        rsvpDeadline: event.rsvpDeadline ? event.rsvpDeadline : null,
                        allowCompanions: event.allowCompanions ?? true,
                        collectDietary: event.collectDietary ?? false,
                    }))
                }
            },
            include: {
                events: true
            }
        });

        console.log("API: Wedding created successfully", wedding.id);

        return NextResponse.json({ success: true, data: wedding });
    } catch (error: any) {
        console.error("API Error in POST /api/wedding:", error);

        if (error.name === 'ZodError') {
            const issues = error.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ');
            return NextResponse.json({
                success: false,
                error: { code: 'VALIDATION_ERROR', message: `Validation failed: ${issues}`, details: error.issues }
            }, { status: 400 });
        }

        if (error.code === 'P2002') {
             return NextResponse.json({
                success: false,
                error: { code: 'CONFLICT', message: 'A wedding with this unique identifier already exists.' }
            }, { status: 409 });
        }

        if (error.message?.includes('Prisma') || error.message?.includes('Can\'t reach database')) {
             return NextResponse.json({
                success: false,
                error: { code: 'DATABASE_ERROR', message: 'Database connection issue. Please try again later.' }
            }, { status: 503 });
        }

        return NextResponse.json({
            success: false,
            error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred while saving the wedding.', details: process.env.NODE_ENV === 'development' ? error.message : undefined }
        }, { status: 500 });
    }
}

async function getOrCreateGuestUser() {
    const guestEmail = 'guest@nimantranstudio.com';
    let user = await prisma.user.findUnique({ where: { email: guestEmail } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: guestEmail,
                name: 'Guest User',
                mobileNumber: '0000000000'
            }
        });
    }
    return user.id;
}
