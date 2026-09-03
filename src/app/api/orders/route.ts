import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

/** The logged-in user's paid orders, newest first, for the dashboard's Payment Details page. */
export async function GET(req: NextRequest) {
    const { user, error } = await verifyAuth(req);
    if (error || !user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
        where: { userId: user.id, status: { in: ['paid', 'ready', 'failed'] } },
        orderBy: { createdAt: 'desc' },
        include: {
            bundle: { include: { themeRef: true } },
        },
    });

    // packageId/weddingId are plain FK strings (no Prisma relation declared),
    // so batch-fetch both separately rather than via `include`.
    const weddingIds = orders.map((o) => o.weddingId).filter((id): id is string => !!id);
    const packageIds = orders.map((o) => o.packageId).filter((id): id is string => !!id);
    const [weddings, packages] = await Promise.all([
        weddingIds.length
            ? prisma.wedding.findMany({
                  where: { id: { in: weddingIds } },
                  select: { id: true, groomName: true, brideName: true },
              })
            : Promise.resolve([]),
        packageIds.length
            ? prisma.package.findMany({ where: { id: { in: packageIds } }, select: { id: true, name: true } })
            : Promise.resolve([]),
    ]);
    const weddingById = new Map(weddings.map((w) => [w.id, w]));
    const packageById = new Map(packages.map((p) => [p.id, p]));

    const result = orders.map((o) => {
        const wedding = o.weddingId ? weddingById.get(o.weddingId) : undefined;
        const pkg = o.packageId ? packageById.get(o.packageId) : undefined;
        return {
            id: o.id,
            status: o.status,
            totalAmount: o.totalAmount,
            paymentMethod: o.paymentMethod,
            razorpayPaymentId: o.razorpayPaymentId,
            invoiceNumber: o.invoiceNumber,
            invoiceIssuedAt: o.invoiceIssuedAt,
            createdAt: o.createdAt,
            planName: pkg?.name || null,
            bundleName: o.bundle?.BundleName || null,
            themeName: o.bundle?.themeRef?.name || null,
            themeThumbnail: o.bundle?.themeRef?.thumbnailUrl || null,
            coupleNames: [wedding?.groomName, wedding?.brideName].filter(Boolean).join(' & ') || null,
        };
    });

    return NextResponse.json({ success: true, orders: result });
}
