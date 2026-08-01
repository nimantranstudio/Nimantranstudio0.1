import { messaging, type SendResult } from '@/lib/messaging';

/**
 * Post-payment notifications. These are DELIGHT, not part of the critical path:
 * every call is fire-and-forget and swallows its own errors, so a WhatsApp/SMS
 * outage never affects the user who is already inside their dashboard.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.nimantranstudio.in';

// WhatsApp template configured on the vendor dashboard. Kept in one place so a
// template rename is a one-line change. Matches the MSG91 "welcome_nimantran"
// utility template: an IMAGE header (the couple's hero invitation card), one
// body variable ({{1}} = customer/couple name), and a static "Download My Suite"
// URL button (→ /dashboard/assets) baked into the approved template.
const WELCOME_TEMPLATE = process.env.MSG91_WELCOME_TEMPLATE || 'welcome_nimantran';

/** WhatsApp media headers accept real raster images only — not .html templates. */
function isSendableImage(url?: string): boolean {
    return !!url && /\.(png|jpe?g|webp)(\?|$)/i.test(url);
}

/** Make a relative asset path absolute so WhatsApp's servers can fetch it. */
function absolutize(url?: string): string | undefined {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    return `${APP_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export async function sendWelcomeAndReceipt(opts: {
    mobile: string;
    coupleNames: string;
    amountRupees: number;
    orderId: string;
    heroImageUrl?: string;
}): Promise<SendResult> {
    const { mobile, coupleNames, orderId, heroImageUrl } = opts;
    const couple = coupleNames || 'there';
    // Attach the hero card only if it's a real, fetchable image; otherwise the
    // template still sends text-only (the vendor adapter omits the header).
    const hero = isSendableImage(heroImageUrl) ? absolutize(heroImageUrl) : undefined;

    try {
        const result = await messaging.sendWhatsAppTemplate(
            mobile,
            WELCOME_TEMPLATE,
            [couple],
            hero
        );
        if (!result.success) {
            console.warn(`Welcome WhatsApp not delivered (order ${orderId}): ${result.error}`);
        }
        return result;
    } catch (err: any) {
        console.warn(`Welcome WhatsApp threw (order ${orderId}): ${err?.message}`);
        return { success: false, error: err?.message || 'send threw' };
    }

    // Email receipt is intentionally deferred until an email provider is chosen.
    // The address is already captured on the User record; nothing to send yet.
}
