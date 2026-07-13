import { MessagingProvider, SendResult } from './types';
import { msg91Provider, msg91Configured } from './msg91';

export type { MessagingProvider, SendResult } from './types';

/**
 * Dev/fallback provider: logs instead of sending. Used when no vendor is
 * configured (e.g. MSG91 keys absent) so OTP login stays testable locally — the
 * code is printed to the server console. NEVER reports success for WhatsApp so
 * callers can tell delivery didn't really happen; SMS returns success so the
 * OTP flow completes in development.
 */
const consoleProvider: MessagingProvider = {
    async sendSms(mobile, text): Promise<SendResult> {
        console.log(`[messaging:dev] SMS to ${mobile}: ${text}`);
        return { success: true, id: 'dev-sms' };
    },
    async sendWhatsAppTemplate(mobile, templateName, variables): Promise<SendResult> {
        console.log(
            `[messaging:dev] WhatsApp template "${templateName}" to ${mobile}:`,
            variables
        );
        return { success: false, error: 'messaging not configured (dev stub)' };
    },
};

/** The active provider. Swap this line to change vendors. */
export const messaging: MessagingProvider = msg91Configured
    ? msg91Provider
    : consoleProvider;

export const messagingConfigured = msg91Configured;
