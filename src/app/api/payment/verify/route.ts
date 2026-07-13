import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { WeddingFormSchema } from '@/lib/schemas/wedding-form';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';
import { toTenDigits } from '@/lib/messaging/types';
import { sendWelcomeAndReceipt } from '@/lib/notifications';
import sanitizeHtml from 'sanitize-html';

function sanitize(str: any): string {
    if (!str) return '';
    return sanitizeHtml(String(str), { allowedTags: [], allowedAttributes: {} });
}

// Razorpay returns this placeholder when the payer's email wasn't collected.
function cleanEmail(email?: string | null): string | null {
    if (!email) return null;
    const e = email.trim().toLowerCase();
    if (!e || e === 'void@razorpay.com') return null;
    return e;
}

/**
 * Attach a fresh session cookie for `user` onto a JSON response.
 */
async function withSession(
    body: Record<string, any>,
    user: { id: string; mobileNumber: string; role: string }
) {
    const res = NextResponse.json(body);
    const token = await createSessionToken(user);
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
}

export async function POST(req: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            formData,
        } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const secret = process.env.RAZORPAY_KEY_SECRET || '';
        const keyId = process.env.RAZORPAY_KEY_ID || '';

        // 1. Verify the payment signature. Fail closed: no user, no session.
        const expected = crypto
            .createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expected !== razorpay_signature) {
            return NextResponse.json(
                { error: 'Payment verification failed' },
                { status: 400 }
            );
        }

        // Idempotency: if this order was already fully provisioned, just re-issue
        // the session and return — never provision twice.
        const existing = await prisma.order.findUnique({
            where: { razorpayOrderId: razorpay_order_id },
            include: { user: true },
        });
        if (existing && existing.status === 'ready' && existing.user) {
            return withSession(
                { success: true, weddingId: existing.weddingId, orderId: existing.id },
                existing.user
            );
        }

        // 2. Read authoritative buyer identity + entitlement from Razorpay's
        //    servers — never trust the client for who paid or what for.
        const razorpay = new Razorpay({ key_id: keyId, key_secret: secret });
        const [rzpOrder, rzpPayment] = await Promise.all([
            razorpay.orders.fetch(razorpay_order_id),
            razorpay.payments.fetch(razorpay_payment_id),
        ]);

        const notes = (rzpOrder.notes || {}) as Record<string, string>;
        const themeId = notes.themeId;
        const bundleId = notes.bundleId;
        const packageId = notes.packageId || null;

        const mobile = toTenDigits(String(rzpPayment.contact || ''));
        const email = cleanEmail(rzpPayment.email);
        const amountRupees = Number(rzpPayment.amount) / 100;

        if (!mobile || mobile.length !== 10) {
            return NextResponse.json(
                { error: 'Could not read a valid contact number from the payment' },
                { status: 400 }
            );
        }

        // 3. Find-or-create the user: mobile first, then email. A repeat purchase
        //    from a known number/email attaches to the existing account.
        let user = await prisma.user.findUnique({ where: { mobileNumber: mobile } });
        if (!user && email) {
            user = await prisma.user.findUnique({ where: { email } });
        }
        if (!user) {
            user = await prisma.user.create({
                data: {
                    mobileNumber: mobile,
                    email: email ?? undefined,
                    isMobileVerified: true,
                    role: 'user',
                    status: 'active',
                },
            });
        } else if (email && !user.email) {
            // Backfill email if we now have one and the account lacked it.
            user = await prisma.user.update({
                where: { id: user.id },
                data: { email },
            });
        }

        // 4. Create (or reuse) the local order row.
        const order =
            existing ??
            (await prisma.order.create({
                data: {
                    userId: user.id,
                    bundleId,
                    packageId,
                    totalAmount: amountRupees,
                    status: 'paid',
                    razorpayOrderId: razorpay_order_id,
                    razorpayPaymentId: razorpay_payment_id,
                    contactEmail: email,
                    contactPhone: mobile,
                },
            }));

        if (existing) {
            await prisma.order.update({
                where: { id: existing.id },
                data: {
                    status: 'paid',
                    userId: user.id,
                    razorpayPaymentId: razorpay_payment_id,
                    contactEmail: email,
                    contactPhone: mobile,
                },
            });
        }

        // 5. Provision the wedding suite. If this throws AFTER payment, the user
        //    still gets a session and lands on a "preparing" dashboard — never
        //    stranded on an error. The order is flagged 'failed' for follow-up.
        let weddingId: string | null = null;
        try {
            const validated = WeddingFormSchema.parse(formData || {});
            const wedding = await prisma.wedding.create({
                data: {
                    ownerId: user.id,
                    themeId: sanitize(themeId),
                    groomName: sanitize(validated.groomName),
                    brideName: sanitize(validated.brideName),
                    groomParents: sanitize(validated.groomParents),
                    brideParents: sanitize(validated.brideParents),
                    rsvpContact: sanitize(validated.rsvpContact) || mobile,
                    rsvpDeadline: validated.rsvpDeadline ? new Date(validated.rsvpDeadline) : null,
                    invitationMessage: sanitize(validated.invitationMessage),
                    events: {
                        create: (validated.events || []).map((event) => ({
                            name: sanitize(event.name || 'Untitled Event'),
                            date: sanitize(event.date),
                            time: sanitize(event.time),
                            venue: sanitize(event.venue),
                            mapLink: sanitize(event.mapLink),
                            description: sanitize(event.description),
                            eventType: sanitize(event.eventType),
                            rsvpDeadline: event.rsvpDeadline ? event.rsvpDeadline : null,
                            allowCompanions: event.allowCompanions ?? true,
                            collectDietary: event.collectDietary ?? false,
                        })),
                    },
                },
            });
            weddingId = wedding.id;

            await prisma.order.update({
                where: { id: order.id },
                data: { status: 'ready', weddingId },
            });
        } catch (provisionErr: any) {
            console.error('Provisioning failed after payment:', provisionErr?.message);
            await prisma.order.update({
                where: { id: order.id },
                data: { status: 'failed' },
            });
            // Do NOT rethrow — the payment succeeded; the user must still get in.
        }

        // 6. Fire-and-forget WhatsApp welcome + receipt. Never blocks the response.
        sendWelcomeAndReceipt({
            mobile,
            coupleNames: `${sanitize(formData?.groomName) || ''} ${sanitize(formData?.brideName) || ''}`.trim(),
            amountRupees,
            orderId: order.id,
        }).catch((e) => console.error('Notification dispatch failed:', e));

        // 7. Issue the session and return.
        return withSession({ success: true, weddingId, orderId: order.id }, user);
    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { error: error?.message || 'Verification failed' },
            { status: 500 }
        );
    }
}
