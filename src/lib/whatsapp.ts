/**
 * WhatsApp Business API Service
 * Handles sending OTP and other messages via WhatsApp
 */

const WHATSAPP_API_VERSION = 'v18.0';
const WHATSAPP_API_BASE = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

interface SendMessageResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

interface WhatsAppMessage {
    messaging_product: 'whatsapp';
    to: string;
    type: 'template' | 'text';
    template?: {
        name: string;
        language: {
            code: string;
        };
        components?: Array<{
            type: 'body';
            parameters: Array<{ type: 'text'; text: string }>;
        }>;
    };
    text?: {
        body: string;
    };
}

/**
 * Send OTP via WhatsApp
 */
export async function sendWhatsAppOTP(
    phoneNumber: string,
    otp: string
): Promise<SendMessageResponse> {
    try {
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

        if (!accessToken || !phoneNumberId) {
            console.error('WhatsApp credentials missing');
            return {
                success: false,
                error: 'WhatsApp credentials not configured'
            };
        }

        // Ensure phone number is in international format (e.g., 919876543210)
        const formattedPhone = formatPhoneNumber(phoneNumber);

        const message: WhatsAppMessage = {
            messaging_product: 'whatsapp',
            to: formattedPhone,
            type: 'text',
            text: {
                body: `🔐 Your Nimantran Studio verification code is:\n\n${otp}\n\nThis code expires in 10 minutes.\nDon't share this with anyone!`
            }
        };

        const response = await fetch(
            `${WHATSAPP_API_BASE}/${phoneNumberId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('WhatsApp API error:', data);
            return {
                success: false,
                error: data.error?.message || 'Failed to send OTP'
            };
        }

        console.log('OTP sent via WhatsApp:', {
            phoneNumber: formattedPhone,
            messageId: data.messages?.[0]?.id
        });

        return {
            success: true,
            messageId: data.messages?.[0]?.id
        };
    } catch (error: any) {
        console.error('WhatsApp OTP error:', error);
        return {
            success: false,
            error: error.message || 'Failed to send WhatsApp message'
        };
    }
}

/**
 * Send generic WhatsApp message
 */
export async function sendWhatsAppMessage(
    phoneNumber: string,
    message: string
): Promise<SendMessageResponse> {
    try {
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

        if (!accessToken || !phoneNumberId) {
            return {
                success: false,
                error: 'WhatsApp credentials not configured'
            };
        }

        const formattedPhone = formatPhoneNumber(phoneNumber);

        const response = await fetch(
            `${WHATSAPP_API_BASE}/${phoneNumberId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: formattedPhone,
                    type: 'text',
                    text: { body: message }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('WhatsApp API error:', data);
            return {
                success: false,
                error: data.error?.message || 'Failed to send message'
            };
        }

        return {
            success: true,
            messageId: data.messages?.[0]?.id
        };
    } catch (error: any) {
        console.error('WhatsApp message error:', error);
        return {
            success: false,
            error: error.message || 'Failed to send WhatsApp message'
        };
    }
}

/**
 * Format phone number to international format (91 + 10-digit number)
 */
function formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // If it already starts with 91 and is 12 digits, return as-is
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        return cleaned;
    }

    // If it's 10 digits (Indian number), add 91 prefix
    if (cleaned.length === 10) {
        return '91' + cleaned;
    }

    // Otherwise, assume it's already properly formatted
    return cleaned;
}
