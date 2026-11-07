/**
 * Website purchase: opens Razorpay straight from the details page (no separate
 * payment screen). Same server routes as card checkout:
 *   /api/payment/create-order  — price read from WebsiteTemplate on the server
 *   /api/payment/verify        — signature check, account, wedding, Order,
 *                                Payment, WeddingWebsite (published), WhatsApp
 */

const RAZORPAY_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

// Image header for the post-payment WhatsApp messages (website orders have no
// card to capture). Same image the guest site uses for its link preview.
const WEBSITE_SHARE_IMAGE = '/og-image.png';

type RazorpayWindow = Window & { Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: (r: unknown) => void) => void } };

function loadRazorpay(): Promise<void> {
    const w = window as RazorpayWindow;
    if (w.Razorpay) return Promise.resolve();
    return new Promise((resolve, reject) => {
        const existing = document.getElementById('razorpay-checkout-js') as HTMLScriptElement | null;
        const script = existing ?? document.createElement('script');
        script.addEventListener('load', () => resolve());
        script.addEventListener('error', () => reject(new Error('Could not load the payment window. Check your connection and try again.')));
        if (!existing) {
            script.id = 'razorpay-checkout-js';
            script.src = RAZORPAY_SRC;
            document.head.appendChild(script);
        }
    });
}

export type WebsiteCheckoutResult =
    | { status: 'paid'; weddingId: string | null; orderId: string }
    | { status: 'dismissed' };

interface WebsiteCheckoutOptions {
    templateCode: string;
    templateName: string;
    /** The details form, saved as the wedding once payment is verified. */
    formData: { groomName?: string; brideName?: string; rsvpContact?: string } & Record<string, unknown>;
    contact?: string | null;
    /** Called when Razorpay reports success, before the server finishes publishing. */
    onPaymentCaptured?: () => void;
}

export async function payForWebsite({
    templateCode,
    templateName,
    formData,
    contact,
    onPaymentCaptured,
}: WebsiteCheckoutOptions): Promise<WebsiteCheckoutResult> {
    const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productType: 'WEBSITE', templateCode, currency: 'INR' }),
    });
    const order = await res.json().catch(() => ({}));
    if (!res.ok || !order.orderId || !order.key) {
        throw new Error(order.error || 'We could not start the payment. Please try again.');
    }

    await loadRazorpay();
    const Razorpay = (window as RazorpayWindow).Razorpay;
    if (!Razorpay) throw new Error('Could not load the payment window. Please try again.');

    return new Promise<WebsiteCheckoutResult>((resolve, reject) => {
        const rzp = new Razorpay({
            key: order.key,
            amount: order.amount,
            currency: order.currency,
            name: 'Nimantran Studio',
            description: `Wedding Website · ${templateName}`,
            order_id: order.orderId,
            prefill: {
                name: [formData.groomName, formData.brideName].filter(Boolean).join(' '),
                contact: contact || formData.rsvpContact || '',
            },
            // UPI only (QR code and UPI apps), as on card checkout.
            method: { upi: true, card: false, netbanking: false, wallet: false, paylater: false, emi: false },
            theme: { color: '#C8A951' },
            modal: {
                // Closed without paying: nothing to record, the customer can try again.
                ondismiss: () => resolve({ status: 'dismissed' }),
            },
            handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
                onPaymentCaptured?.();
                try {
                    const verifyRes = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...response, formData, heroImageUrl: WEBSITE_SHARE_IMAGE }),
                    });
                    const verified = await verifyRes.json().catch(() => ({}));
                    if (!verifyRes.ok || !verified.success) {
                        throw new Error(verified.error || 'Payment verification failed');
                    }
                    resolve({ status: 'paid', weddingId: verified.weddingId ?? null, orderId: verified.orderId });
                } catch (err) {
                    reject(
                        new Error(
                            `We received your payment but could not finish publishing. Please contact us on WhatsApp at +91 80105 81916 with payment reference ${response.razorpay_payment_id}.`,
                            { cause: err }
                        )
                    );
                }
            },
        });
        // A failed attempt keeps the Razorpay window open so the customer can retry there.
        rzp.on('payment.failed', (r) => console.warn('Website payment attempt failed', r));
        rzp.open();
    });
}
