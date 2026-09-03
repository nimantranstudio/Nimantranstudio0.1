import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-server';
import { ensureInvoiceNumber } from '@/lib/invoice/invoice-number';
import { generateInvoicePdf } from '@/lib/invoice/generate-invoice-pdf';

export const dynamic = 'force-dynamic';

/** Streams a simple payment receipt PDF for one of the logged-in user's own paid orders. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { user, error } = await verifyAuth(req);
    if (error || !user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order || order.userId !== user.id) {
        return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    if (!['paid', 'ready', 'failed'].includes(order.status)) {
        return NextResponse.json({ success: false, error: 'No receipt for this order yet' }, { status: 400 });
    }

    const { invoiceNumber, invoiceIssuedAt } = await ensureInvoiceNumber(order.id);

    const pkg = order.packageId
        ? await prisma.package.findUnique({ where: { id: order.packageId }, select: { name: true } })
        : null;
    const bundle = await prisma.bundle.findUnique({
        where: { id: order.bundleId },
        select: { BundleName: true },
    });

    const itemDescription = [pkg?.name, bundle?.BundleName].filter(Boolean).join(' — ') || 'Nimantran Studio Wedding Suite';

    const pdfBuffer = await generateInvoicePdf({
        invoiceNumber,
        invoiceDate: invoiceIssuedAt,
        orderId: order.id,
        razorpayPaymentId: order.razorpayPaymentId,
        paymentMethod: order.paymentMethod,
        billTo: { phone: order.contactPhone },
        itemDescription,
        totalAmount: order.totalAmount,
    });

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${invoiceNumber.replace(/\//g, '-')}.pdf"`,
            'Cache-Control': 'private, no-store',
        },
    });
}
