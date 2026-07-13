import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';

/**
 * Creates a Razorpay order for the selected theme + package.
 *
 * The price is derived SERVER-SIDE from BundleInvoice.finalSellingPrice — the
 * client never sends an amount, closing the under-payment hole in the old code.
 * The chosen bundle/package are stamped into the Razorpay order `notes` so the
 * verify step reads the entitlement server-to-server rather than trusting the
 * browser.
 */
export async function POST(req: NextRequest) {
    try {
        const { themeId, packageName, currency = 'INR' } = await req.json();

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

        const pkg = await prisma.package.findFirst({
            where: { name: packageName, isActive: true },
        });
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

        const amountPaise = Math.round(invoice.finalSellingPrice * 100);
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
