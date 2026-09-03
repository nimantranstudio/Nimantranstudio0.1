import { prisma } from '@/lib/prisma';

/** Indian financial year (Apr–Mar) label for a date, e.g. "2026-27". */
function financialYearLabel(date: Date): string {
    const y = date.getFullYear();
    const isBeforeApril = date.getMonth() < 3; // Jan–Mar belongs to the FY that started the previous April
    const startYear = isBeforeApril ? y - 1 : y;
    return `${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`;
}

/**
 * Assigns a stable, sequential GST invoice number to an order on first call
 * and returns the same number on every later call — GST invoice numbers must
 * never be skipped or reused, so this only ever moves forward.
 */
export async function ensureInvoiceNumber(
    orderId: string
): Promise<{ invoiceNumber: string; invoiceIssuedAt: Date }> {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
        if (order.invoiceNumber && order.invoiceIssuedAt) {
            return { invoiceNumber: order.invoiceNumber, invoiceIssuedAt: order.invoiceIssuedAt };
        }

        const fy = financialYearLabel(order.createdAt);
        const counter = await tx.invoiceCounter.upsert({
            where: { id: fy },
            create: { id: fy, seq: 1 },
            update: { seq: { increment: 1 } },
        });
        const invoiceNumber = `NS/${fy}/${String(counter.seq).padStart(4, '0')}`;
        const invoiceIssuedAt = new Date();

        await tx.order.update({
            where: { id: orderId },
            data: { invoiceNumber, invoiceIssuedAt },
        });

        return { invoiceNumber, invoiceIssuedAt };
    });
}
