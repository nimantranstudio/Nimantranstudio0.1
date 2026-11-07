import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { rateLimit, clientKey } from '@/lib/rate-limit';

/**
 * Creates a Razorpay order for the selected theme + package.
 *
 * The price is derived SERVER-SIDE from BundleInvoice.finalSellingPrice — the
 * client never sends an amount, closing the under-payment hole in the old code.
 * The chosen bundle/package are stamped into the Razorpay order `notes` so the
 * verify step reads the entitlement server-to-server rather than trusting the
 * browser.
 */
/**
 * Razorpay order for a wedding website design. The price comes from the
 * WebsiteTemplate row (server-side only), and everything verify needs to
 * record the purchase is stamped into the order notes, which verify reads
 * back from Razorpay rather than trusting the browser.
 */
async function createWebsiteOrder(templateCode: string) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
        return NextResponse.json({ error: 'Razorpay credentials not configured' }, { status: 500 });
    }

    const template = await prisma.websiteTemplate.findUnique({ where: { code: templateCode } });
    if (!template || template.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'This website design is not available to buy' }, { status: 404 });
    }
    if (!template.cardThemeId || !template.cardBundleId) {
        return NextResponse.json({ error: 'Online checkout is not set up for this design yet' }, { status: 409 });
    }

    // Same test-mode switch as card orders: a flat ₹10 when PAYMENT_TEST_MODE=true.
    const testMode = process.env.PAYMENT_TEST_MODE === 'true';
    const amountPaise = testMode ? 1000 : template.salePricePaise;
    if (amountPaise < 100) {
        return NextResponse.json({ error: 'Amount below minimum' }, { status: 409 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
        amount: amountPaise,
        currency: template.currency,
        receipt: `ns_web_${Date.now()}`,
        // Razorpay notes are strings (max 15 keys).
        notes: {
            productType: 'WEBSITE',
            templateId: template.id,
            templateCode: template.code,
            templateVersion: String(template.version),
            listPricePaise: String(template.listPricePaise),
            salePricePaise: String(template.salePricePaise),
            gstRateBps: String(template.gstRateBps),
            validityDays: template.validityDays == null ? '' : String(template.validityDays),
            themeId: template.cardThemeId,
            bundleId: template.cardBundleId,
        },
    });

    return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: keyId,
    });
}

export async function POST(req: NextRequest) {
    try {
        // Unauthenticated by necessity (checkout precedes the session), so cap
        // it — a real buyer creates a couple of orders, not hundreds.
        const limit = rateLimit(clientKey(req, 'create-order'), { limit: 20, windowMs: 10 * 60 * 1000 });
        if (!limit.ok) {
            return NextResponse.json(
                { error: 'Too many attempts. Please try again shortly.' },
                { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
            );
        }

        const { themeId, packageName, currency = 'INR', productType, templateCode } = await req.json();

        // Wedding website purchase: priced from WebsiteTemplate, not from a
        // card bundle. The card path below is unchanged.
        if (productType === 'WEBSITE') {
            // await, so gateway errors reach the catch below like card orders.
            return await createWebsiteOrder(String(templateCode || ''));
        }

        if (!themeId || !packageName) {
            return NextResponse.json(
                { error: 'themeId and packageName are required' },
                { status: 400 }
            );
        }

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keyId || !keySecret) {
            return NextResponse.json(
                { error: 'Razorpay credentials not configured' },
                { status: 500 }
            );
        }

        // Resolve the authoritative price from the database.
        const theme = await prisma.theme.findUnique({
            where: { id: themeId },
            include: { bundles: { include: { bundleInvoices: true } } },
        });
        const bundle = theme?.bundles?.[0];
        if (!bundle) {
            return NextResponse.json(
                { error: 'No bundle found for this theme' },
                { status: 404 }
            );
        }

        // Accept either the package's real name ("WhatsApp Essentials") or the
        // plan key ("essentials") that some client flows send.
        const PLAN_KEY_TO_NAME: Record<string, string> = {
            essentials: 'WhatsApp Essentials',
            posters: 'WhatsApp + Posters',
            complete: 'Complete Wedding Suite',
        };
        let pkg = await prisma.package.findFirst({
            where: { name: packageName, isActive: true },
        });
        if (!pkg) {
            const mapped = PLAN_KEY_TO_NAME[String(packageName).toLowerCase()];
            if (mapped) {
                pkg = await prisma.package.findFirst({
                    where: { name: mapped, isActive: true },
                });
            }
        }
        if (!pkg) {
            return NextResponse.json(
                { error: 'Unknown package' },
                { status: 404 }
            );
        }

        const invoice = bundle.bundleInvoices.find(
            (inv) => inv.packageId === pkg.id
        );
        if (!invoice || !invoice.finalSellingPrice || invoice.finalSellingPrice <= 0) {
            return NextResponse.json(
                { error: 'Price not configured for this selection' },
                { status: 409 }
            );
        }

        // Test mode: charge a flat ₹10 regardless of the real price, so the full
        // checkout flow can be exercised for real without collecting real money.
        // Server-side only — never trust a client-sent amount. Flip
        // PAYMENT_TEST_MODE off (or unset it) to restore real pricing; no code
        // change needed.
        const testMode = process.env.PAYMENT_TEST_MODE === 'true';
        const amountPaise = testMode ? 1000 : Math.round(invoice.finalSellingPrice * 100);
        if (amountPaise < 100) {
            return NextResponse.json(
                { error: 'Amount below minimum' },
                { status: 409 }
            );
        }

        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const order = await razorpay.orders.create({
            amount: amountPaise,
            currency,
            receipt: `ns_${bundle.id}_${Date.now()}`,
            notes: {
                themeId,
                bundleId: bundle.id,
                packageId: pkg.id,
                packageName,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: keyId,
        });
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        if (error?.statusCode === 401) {
            return NextResponse.json(
                { error: 'Razorpay authentication failed - check credentials' },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: error?.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}
