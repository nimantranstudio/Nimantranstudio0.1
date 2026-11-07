import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { WeddingFormSchema } from '@/lib/schemas/wedding-form';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';
import { toTenDigits } from '@/lib/messaging/types';
import { sendWelcomeAndReceipt, sendRsvpLink } from '@/lib/notifications';
import { ensureInvoiceNumber } from '@/lib/invoice/invoice-number';
import { generateUniqueWeddingSlug } from '@/lib/slug';
import sanitizeHtml from 'sanitize-html';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.nimantranstudio.in';

const PAYMENT_STATUS: Record<string, 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED'> = {
    created: 'CREATED',
    authorized: 'AUTHORIZED',
    captured: 'CAPTURED',
    failed: 'FAILED',
    refunded: 'REFUNDED',
};

/** Price snapshot for a website order, from the Razorpay order notes. */
function websiteOrderFields(notes: Record<string, string>, paidPaise: number) {
    const listPricePaise = Number(notes.listPricePaise) || paidPaise;
    const salePricePaise = Number(notes.salePricePaise) || paidPaise;
    const gstRateBps = Number(notes.gstRateBps) || 1800;
    // GST is included in the price: tax = total − total / (1 + rate).
    const taxPaise = paidPaise - Math.round((paidPaise * 10000) / (10000 + gstRateBps));
    return {
        productType: 'WEBSITE' as const,
        websiteTemplateId: notes.templateId || null,
        currency: 'INR',
        listPricePaise,
        discountPaise: Math.max(0, listPricePaise - salePricePaise),
        taxPaise,
        totalPaise: paidPaise,
        paidAt: new Date(),
    };
}

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
            heroImageUrl,
            whatsappNumber,
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
                {
                    success: true,
                    weddingId: existing.weddingId,
                    orderId: existing.id,
                    receipt: {
                        amount: existing.totalAmount,
                        invoiceNumber: existing.invoiceNumber,
                        paymentMethod: existing.paymentMethod,
                    },
                },
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
        const isWebsite = notes.productType === 'WEBSITE';

        // Prefer the WhatsApp number the couple explicitly entered at checkout;
        // fall back to the Razorpay payment contact. This is the account + welcome number.
        const explicit = toTenDigits(String(whatsappNumber || ''));
        const mobile = explicit.length === 10 ? explicit : toTenDigits(String(rzpPayment.contact || ''));
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
                    paymentMethod: rzpPayment.method || null,
                    contactEmail: email,
                    contactPhone: mobile,
                    ...(isWebsite ? websiteOrderFields(notes, Number(rzpPayment.amount)) : {}),
                },
            }));

        if (existing) {
            await prisma.order.update({
                where: { id: existing.id },
                data: {
                    status: 'paid',
                    userId: user.id,
                    razorpayPaymentId: razorpay_payment_id,
                    paymentMethod: rzpPayment.method || null,
                    contactEmail: email,
                    contactPhone: mobile,
                    ...(isWebsite ? websiteOrderFields(notes, Number(rzpPayment.amount)) : {}),
                },
            });
        }

        // Website orders: keep every payment attempt as its own row. The
        // unique (gateway, gatewayPaymentId) makes a repeat verify a no-op.
        if (isWebsite) {
            try {
                const status = PAYMENT_STATUS[String(rzpPayment.status)] || 'CREATED';
                const at = rzpPayment.created_at ? new Date(Number(rzpPayment.created_at) * 1000) : new Date();
                const paymentData = {
                    status,
                    method: rzpPayment.method || null,
                    amountPaise: Number(rzpPayment.amount),
                    currency: String(rzpPayment.currency || 'INR'),
                    capturedAt: status === 'CAPTURED' ? new Date() : null,
                    authorizedAt: status === 'AUTHORIZED' || status === 'CAPTURED' ? at : null,
                    errorCode: (rzpPayment as any).error_code || null,
                    errorReason: (rzpPayment as any).error_reason || null,
                    errorDescription: (rzpPayment as any).error_description || null,
                    // Support reference only; no card or bank numbers.
                    gatewayResponse: {
                        id: rzpPayment.id,
                        status: rzpPayment.status,
                        method: rzpPayment.method,
                        amount: rzpPayment.amount,
                        currency: rzpPayment.currency,
                        captured: rzpPayment.captured,
                        created_at: rzpPayment.created_at,
                    },
                };
                await prisma.payment.upsert({
                    where: { gateway_gatewayPaymentId: { gateway: 'RAZORPAY', gatewayPaymentId: razorpay_payment_id } },
                    update: paymentData,
                    create: {
                        ...paymentData,
                        orderId: order.id,
                        userId: user.id,
                        gateway: 'RAZORPAY',
                        gatewayOrderId: razorpay_order_id,
                        gatewayPaymentId: razorpay_payment_id,
                    },
                });
            } catch (paymentErr: any) {
                console.error('Recording website payment failed:', paymentErr?.message);
            }
        }

        // Payment is confirmed at this point (signature verified above) — issue
        // the receipt number now, independent of whether suite provisioning
        // below succeeds. Never blocks the response.
        let invoiceNumber: string | null = null;
        try {
            invoiceNumber = (await ensureInvoiceNumber(order.id)).invoiceNumber;
        } catch (invoiceErr: any) {
            console.error('Invoice numbering failed:', invoiceErr?.message);
        }

        // 5. Provision the wedding suite. If this throws AFTER payment, the user
        //    still gets a session and lands on a "preparing" dashboard — never
        //    stranded on an error. The order is flagged 'failed' for follow-up.
        let weddingId: string | null = null;
        let weddingSlug: string | null = null;
        try {
            const validated = WeddingFormSchema.parse(formData || {});
            const slug = await generateUniqueWeddingSlug(validated.groomName, validated.brideName);
            const wedding = await prisma.wedding.create({
                data: {
                    ownerId: user.id,
                    slug,
                    themeId: sanitize(themeId),
                    groomName: sanitize(validated.groomName),
                    brideName: sanitize(validated.brideName),
                    groomParents: sanitize(validated.groomParents),
                    brideParents: sanitize(validated.brideParents),
                    rsvpContact: sanitize(validated.rsvpContact) || mobile,
                    rsvpDeadline: validated.rsvpDeadline ? new Date(validated.rsvpDeadline) : null,
                    invitationMessage: sanitize(validated.invitationMessage),
                    events: {
                        create: (() => {
                            const list = (validated.events || []).map((event) => ({
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
                            }));
                            const hasWedding = list.some(e => e.name?.toLowerCase().includes('wedding') || e.eventType === 'Wedding');
                            if (!hasWedding) {
                                list.unshift({
                                    name: 'Wedding Ceremony',
                                    date: sanitize(validated.primaryDate),
                                    time: sanitize(validated.primaryTime),
                                    venue: sanitize(validated.defaultVenueName),
                                    mapLink: sanitize(validated.primaryMapLink),
                                    description: 'The Wedding Ceremony',
                                    eventType: 'Wedding',
                                    rsvpDeadline: validated.rsvpDeadline ? sanitize(validated.rsvpDeadline) : null,
                                    allowCompanions: true,
                                    collectDietary: false,
                                });
                            }
                            return list;
                        })()
                    }
                }
            });
            weddingId = wedding.id;
            weddingSlug = wedding.slug;
            await prisma.order.update({
                where: { id: order.id },
                data: { status: 'ready', weddingId },
            });
        } catch (provisionErr: any) {
            console.error('Provisioning failed after payment:', provisionErr?.message);

            // The payment signature already verified, so this customer is entitled
            // to a suite. Previously this branch left them with NO Wedding row at
            // all — so every later login resolved to the empty "choose a theme"
            // state, with the paid order pointing at nothing and no way back.
            //
            // Fall back to a minimal wedding keyed to the same order. Placeholder
            // names they can correct beat a dashboard that never appears; the
            // order is still flagged for follow-up either way.
            try {
                const fallbackGroom = sanitize(formData?.groomName) || 'Groom';
                const fallbackBride = sanitize(formData?.brideName) || 'Bride';
                const fallbackSlug = await generateUniqueWeddingSlug(fallbackGroom, fallbackBride);
                const fallbackWedding = await prisma.wedding.create({
                    data: {
                        ownerId: user.id,
                        slug: fallbackSlug,
                        themeId: sanitize(themeId),
                        groomName: fallbackGroom,
                        brideName: fallbackBride,
                        rsvpContact: mobile,
                        events: {
                            create: [{
                                name: 'Wedding Ceremony',
                                eventType: 'Wedding',
                                description: 'The Wedding Ceremony',
                                date: sanitize(formData?.primaryDate),
                                time: sanitize(formData?.primaryTime),
                                venue: sanitize(formData?.defaultVenueName),
                                allowCompanions: true,
                                collectDietary: false,
                            }],
                        },
                    },
                });
                weddingId = fallbackWedding.id;
                weddingSlug = fallbackWedding.slug;
                console.warn(`Provisioned fallback wedding ${weddingId} for order ${order.id} after validation failure`);
                await prisma.order.update({
                    where: { id: order.id },
                    data: { status: 'needs_review', weddingId },
                });
            } catch (fallbackErr: any) {
                console.error('Fallback provisioning ALSO failed:', fallbackErr?.message);
                await prisma.order.update({
                    where: { id: order.id },
                    data: { status: 'failed' },
                });
            }
            // Do NOT rethrow — the payment succeeded; the user must still get in.
        }

        // 5b. Website orders: publish the wedding website. The guest page is
        //     /rsvp/{slug} (the slug lives on Wedding and never changes);
        //     this records what was bought, for how much, and where it lives.
        let websiteId: string | null = null;
        if (isWebsite && weddingId) {
            const now = new Date();
            const validityDays = Number(notes.validityDays) || 0;
            try {
                const website = await prisma.weddingWebsite.upsert({
                    where: { weddingId },
                    update: {},
                    create: {
                        weddingId,
                        userId: user.id,
                        templateId: notes.templateId,
                        templateVersion: Number(notes.templateVersion) || 1,
                        status: 'PUBLISHED',
                        orderId: order.id,
                        pricePaidPaise: Number(rzpPayment.amount),
                        purchasedAt: now,
                        publicUrl: `${APP_URL}/rsvp/${weddingSlug || weddingId}`,
                        firstPublishedAt: now,
                        publishedAt: now,
                        publishAttempts: 1,
                        expiresAt: validityDays > 0 ? new Date(now.getTime() + validityDays * 86_400_000) : null,
                        linkMessageStatus: 'PENDING',
                        linkSentTo: mobile,
                    },
                });
                websiteId = website.id;
                await prisma.order.update({ where: { id: order.id }, data: { weddingWebsiteId: website.id } });
            } catch (websiteErr: any) {
                console.error(`Publishing website failed for order ${order.id}:`, websiteErr?.message);
                await prisma.order
                    .update({ where: { id: order.id }, data: { status: 'needs_review' } })
                    .catch(() => {});
            }
        }

        // 6. Fire-and-forget WhatsApp welcome + receipt. Never blocks the response.
        const groomName = sanitize(formData?.groomName) || undefined;
        const brideName = sanitize(formData?.brideName) || undefined;
        const coupleNames = [groomName, brideName].filter(Boolean).join(' ');
        const heroUrl = typeof heroImageUrl === 'string' ? heroImageUrl : undefined;
        sendWelcomeAndReceipt({
            mobile,
            coupleNames,
            amountRupees,
            orderId: order.id,
            heroImageUrl: heroUrl,
        }).catch((e) => console.error('Notification dispatch failed:', e));

        // 6b. The RSVP link, as its own follow-up message — only once a wedding
        // (and therefore an RSVP page) actually exists to link to.
        if (weddingId) {
            sendRsvpLink({
                mobile,
                groomName,
                brideName,
                weddingId,
                slug: weddingSlug || undefined,
                orderId: order.id,
                heroImageUrl: heroUrl,
            })
                .then((result) => {
                    // Website orders: record whether the link message went out.
                    if (!websiteId) return;
                    return prisma.weddingWebsite.update({
                        where: { id: websiteId },
                        data: result.success
                            ? { linkMessageStatus: 'SENT', linkMessageId: result.id ?? null, linkSentAt: new Date(), linkMessageError: null }
                            : { linkMessageStatus: 'FAILED', linkMessageError: result.error ?? 'Send failed' },
                    });
                })
                .catch((e) => console.error('RSVP link dispatch failed:', e));
        }

        // 7. Issue the session and return.
        return withSession(
            {
                success: true,
                weddingId,
                orderId: order.id,
                receipt: {
                    amount: amountRupees,
                    invoiceNumber,
                    paymentMethod: rzpPayment.method || null,
                },
            },
            user
        );
    } catch (error: any) {
        console.error('Error verifying payment:', error);
        return NextResponse.json(
            { error: error?.message || 'Verification failed' },
            { status: 500 }
        );
    }
}
