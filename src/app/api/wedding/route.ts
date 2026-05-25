import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';
import { WeddingFormSchema } from '@/lib/schemas/wedding-form';
import { verifyAuth } from '@/lib/auth-server';
import sanitizeHtml from 'sanitize-html';

function sanitize(str: any): string {
    if (!str) return '';
    return sanitizeHtml(String(str), { allowedTags: [], allowedAttributes: {} });
}

export async function POST(req: NextRequest) {
    console.log("API: POST /api/wedding called");
    try {
        const { user, error } = await verifyAuth(req);
        if (error || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        console.log("API: Request body received", JSON.stringify(body, null, 2));

        const validatedData = WeddingFormSchema.parse(body.formData);
        console.log("API: Validation passed");

        const { selectedThemeId } = body;

        const finalUserId = user.id;
        console.log("API: User ID resolved", finalUserId);

        const wedding = await prisma.wedding.create({
            data: {
                ownerId: finalUserId,
                // Default to 'rajputana' if themeId is missing (e.g. created via dashboard directly)
                themeId: sanitize(selectedThemeId),
                groomName: sanitize(validatedData.groomName),
                brideName: sanitize(validatedData.brideName),
                groomParents: sanitize(validatedData.groomParents),
                brideParents: sanitize(validatedData.brideParents),
                rsvpContact: sanitize(validatedData.rsvpContact),
                rsvpDeadline: validatedData.rsvpDeadline ? new Date(validatedData.rsvpDeadline) : null,
                invitationMessage: sanitize(validatedData.invitationMessage),
                events: {
                    create: (validatedData.events || []).map(event => ({
                        name: sanitize(event.name || 'Untitled Event'),
                        date: sanitize(event.date),
                        time: sanitize(event.time),
                        venue: sanitize(event.venue),
                        mapLink: sanitize(event.mapLink),
                        description: sanitize(event.description),
                        eventType: sanitize(event.eventType),
                        // Ensure empty string becomes null for DateTime field
                        rsvpDeadline: event.rsvpDeadline ? event.rsvpDeadline : null,
                        allowCompanions: event.allowCompanions ?? true,
                        collectDietary: event.collectDietary ?? false,
                        // maxGuests: event.maxGuests 
                    }))
                }
            },
            include: {
                events: true
            }
        });

        console.log("API: Wedding created successfully", wedding.id);
        console.log("API: Created Events:", wedding.events.length);

        return NextResponse.json({ success: true, wedding });
    } catch (error: any) {
        console.error("API Error in POST /api/wedding:", error);
        if (error.name === 'ZodError') {
            const issues = error.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ');
            console.error("API: Validation Failed:", issues);
            return NextResponse.json({ success: false, error: `Validation failed: ${issues}` }, { status: 400 });
        }

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
                name: 'Guest User',
                mobileNumber: '0000000000'
            }
        });
    }
    return user.id;
}
