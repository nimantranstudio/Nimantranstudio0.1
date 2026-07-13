import { messaging } from '@/lib/messaging';

/**
 * Post-payment notifications. These are DELIGHT, not part of the critical path:
 * every call is fire-and-forget and swallows its own errors, so a WhatsApp/SMS
 * outage never affects the user who is already inside their dashboard.
 */

const DASHBOARD_URL =
    process.env.NEXT_PUBLIC_APP_URL || 'https://www.nimantranstudio.in';

// WhatsApp templates configured on the vendor dashboard. Kept in one place so a
// template rename is a one-line change.
const WELCOME_TEMPLATE = process.env.MSG91_WELCOME_TEMPLATE || 'wedding_welcome';

export async function sendWelcomeAndReceipt(opts: {
    mobile: string;
    coupleNames: string;
    amountRupees: number;
    orderId: string;
}): Promise<void> {
    const { mobile, coupleNames, amountRupees, orderId } = opts;
    const couple = coupleNames || 'your celebration';

    try {
        const result = await messaging.sendWhatsAppTemplate(mobile, WELCOME_TEMPLATE, [
            couple,
            `₹${amountRupees.toFixed(2)}`,
            `${DASHBOARD_URL}/dashboard`,
        ]);
        if (!result.success) {
            console.warn(`Welcome WhatsApp not delivered (order ${orderId}): ${result.error}`);
        }
    } catch (err: any) {
        console.warn(`Welcome WhatsApp threw (order ${orderId}): ${err?.message}`);
    }

    // Email receipt is intentionally deferred until an email provider is chosen.
    // The address is already captured on the User record; nothing to send yet.
}
