import { prisma } from '@/lib/prisma';

/**
 * The headline price shown on non-theme-specific pages (homepage, /pricing).
 *
 * Read from the same admin-configured BundleInvoice rows the theme detail page
 * uses, so the anchor can't drift from what a customer actually sees at
 * checkout — those pages previously hardcoded ₹2,500 / SAVE ₹1,501 while the
 * configured bundle was ₹3,248 → ₹999.
 *
 * Mirrors ThemeCard's selection rules: only rows flagged isDisplay with a real
 * selling price count, and the lowest of those wins (it's the "from" price).
 */
export interface HeadlinePricing {
    /** What the customer pays, e.g. 999. */
    price: number;
    /** Struck-through anchor, e.g. 3248. Zero when not configured above price. */
    originalPrice: number;
    /** originalPrice - price, or 0 when there's nothing to claim. */
    savings: number;
}

/** Used only if pricing has never been configured, so the page still renders. */
const FALLBACK: HeadlinePricing = { price: 999, originalPrice: 0, savings: 0 };

export async function getHeadlinePricing(): Promise<HeadlinePricing> {
    try {
        const invoices = await prisma.bundleInvoice.findMany({
            where: {
                isDisplay: true,
                bundle: { isActive: true },
                package: { isActive: true },
            },
            select: { finalSellingPrice: true, totalWeddingSuiteValue: true },
        });

        const priced = invoices.filter((i) => i.finalSellingPrice > 0);
        if (priced.length === 0) return FALLBACK;

        const cheapest = priced.reduce((min, i) =>
            i.finalSellingPrice < min.finalSellingPrice ? i : min
        );

        const price = cheapest.finalSellingPrice;
        const originalPrice = cheapest.totalWeddingSuiteValue > price ? cheapest.totalWeddingSuiteValue : 0;

        return {
            price,
            originalPrice,
            savings: originalPrice > 0 ? originalPrice - price : 0,
        };
    } catch (error) {
        console.error('getHeadlinePricing failed, using fallback:', error);
        return FALLBACK;
    }
}
