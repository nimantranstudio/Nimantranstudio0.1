/**
 * Vendor-neutral messaging interface.
 *
 * Auth and notifications depend on THIS interface, never on a concrete vendor.
 * Swapping MSG91 for Twilio / Fast2SMS / AWS SNS later means writing one new file
 * that implements `MessagingProvider` and pointing `index.ts` at it — no changes
 * to OTP logic or the payment flow.
 */

export interface SendResult {
    success: boolean;
    id?: string;
    error?: string;
}

export interface MessagingProvider {
    /** Deliver a plain transactional SMS (used for OTP). */
    sendSms(mobile: string, text: string): Promise<SendResult>;

    /**
     * Deliver a WhatsApp template message (used for welcome / receipt).
     * `variables` fill the template body placeholders in order.
     * `mediaUrl` is an optional public URL for a document/image header.
     */
    sendWhatsAppTemplate(
        mobile: string,
        templateName: string,
        variables: string[],
        mediaUrl?: string
    ): Promise<SendResult>;
}

/** Normalize an Indian mobile number to bare 10 digits (drops +91 / 91 / spaces). */
export function toTenDigits(mobile: string): string {
    const digits = (mobile || '').replace(/\D/g, '');
    if (digits.length > 10) return digits.slice(-10);
    return digits;
}

/** Normalize to E.164-style 91XXXXXXXXXX for vendors that want the country code. */
export function toIndiaMsisdn(mobile: string): string {
    return `91${toTenDigits(mobile)}`;
}
