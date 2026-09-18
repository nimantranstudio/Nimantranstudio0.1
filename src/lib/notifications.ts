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

// A second, separate WhatsApp message sent right after the welcome one — the
// shareable RSVP link itself. Kept deliberately short — the link's own Open
// Graph tags (title/description/image, resolved live per wedding — see
// src/app/rsvp/[id]/page.tsx) do the visual work when WhatsApp renders its
// preview card, so the message text just needs to frame it, not repeat it.
// Written entirely in the COUPLE's own voice so it can be forwarded to guests
// exactly as received.
//
// v1 ("rsvp_link_nimantran") is retired — approved as MARKETING category, and
// despite MSG91 accepting every send attempt (no header, generic image header,
// real card header — all tried, all "success" at the API level), it NEVER
// once actually delivered, while the UTILITY-category welcome_nimantran
// worked every time. Root cause: Marketing-category WhatsApp messages require
// explicit recipient opt-in that Utility doesn't, and Meta silently drops
// them downstream rather than bouncing back a clean rejection — MSG91's
// dashboard "header" failure reasons were a red herring the whole time.
//
// v2 is submitted explicitly as UTILITY, WITH an image header (the couple's
// hero card — confirmed necessary, not optional) and two body variables,
// {{1}} = "Groom & Bride", {{2}} = the RSVP page URL. Approval copy:
// "💌 {{1}} here — we're getting married and we'd love for you to be there!
// Tap below to see our invitation and let us know if you can make it: {{2}}"
const RSVP_LINK_TEMPLATE = process.env.MSG91_RSVP_LINK_TEMPLATE || 'rsvp_link_nimantran_v2';

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
        console.log(`[welcome] sending to ${mobile} (order ${orderId}); hero=${hero ? 'yes' : 'no'} template=${WELCOME_TEMPLATE}`);
        const result = await messaging.sendWhatsAppTemplate(
            mobile,
            WELCOME_TEMPLATE,
            [couple],
            hero
        );
        console.log(`[welcome] result (order ${orderId}): ${JSON.stringify(result)}`);
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

/**
 * The RSVP page link, as its own WhatsApp message — deliberately separate
 * from the welcome message so it reads as "here's the thing to forward to
 * your guests" rather than being buried in the account/receipt message.
 * Only fires once a wedding (and therefore an RSVP page) actually exists.
 */
export async function sendRsvpLink(opts: {
    mobile: string;
    groomName?: string;
    brideName?: string;
    weddingId: string;
    slug?: string;
    orderId: string;
    heroImageUrl?: string;
}): Promise<SendResult> {
    const { mobile, groomName, brideName, weddingId, slug, orderId, heroImageUrl } = opts;
    // "Groom & Bride" — reads naturally in a first-person-plural invitation
    // line ("X & Y are getting married") the couple can forward as-is.
    const couple = [groomName, brideName].filter(Boolean).join(' & ') || 'We';
    const rsvpUrl = `${APP_URL}/rsvp/${slug || weddingId}`;
    // Same hero image the welcome message uses — payment/page.tsx already
    // captures the Wedding ceremony card specifically (falling back to the
    // first event only if there's no "wedding"-named one), so this inherits
    // that same correct default rather than whatever card happens to exist.
    const hero = isSendableImage(heroImageUrl) ? absolutize(heroImageUrl) : undefined;

    try {
        console.log(`[rsvp-link] sending to ${mobile} (order ${orderId}); url=${rsvpUrl} hero=${hero ? 'yes' : 'no'} template=${RSVP_LINK_TEMPLATE}`);
        const result = await messaging.sendWhatsAppTemplate(
            mobile,
            RSVP_LINK_TEMPLATE,
            [couple, rsvpUrl],
            hero
        );
        console.log(`[rsvp-link] result (order ${orderId}): ${JSON.stringify(result)}`);
        if (!result.success) {
            console.warn(`RSVP link WhatsApp not delivered (order ${orderId}): ${result.error}`);
        }
        return result;
    } catch (err: any) {
        console.warn(`RSVP link WhatsApp threw (order ${orderId}): ${err?.message}`);
        return { success: false, error: err?.message || 'send threw' };
    }
}
