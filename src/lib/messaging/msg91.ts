import {
    MessagingProvider,
    SendResult,
    toIndiaMsisdn,
} from './types';

/**
 * MSG91 adapter. Implements the vendor-neutral MessagingProvider.
 *
 * SMS goes through MSG91's Flow API with a DLT-approved template
 * (MSG91_DLT_TE_ID); the OTP value fills the template variable — MSG91 is only
 * the delivery pipe, we own the code. WhatsApp uses the outbound-template
 * endpoint with a public media URL for the invitation image.
 */

const AUTHKEY = process.env.MSG91_AUTHKEY;
const SENDER_ID = process.env.MSG91_SENDER_ID;
const SMS_TEMPLATE_ID = process.env.MSG91_DLT_TE_ID; // DLT template for OTP SMS
const WA_NUMBER = process.env.MSG91_WHATSAPP_NUMBER;
const WA_NAMESPACE = process.env.MSG91_WA_NAMESPACE;
// WhatsApp templates are approved under a specific language code — usually en_US,
// not en. Must match the template's language on the MSG91 dashboard exactly.
const WA_LANG = process.env.MSG91_WA_LANG || 'en_US';

const FLOW_URL = 'https://control.msg91.com/api/v5/flow/';
const WA_URL =
    'https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/';

export const msg91Configured = Boolean(AUTHKEY);

export const msg91Provider: MessagingProvider = {
    async sendSms(mobile: string, text: string): Promise<SendResult> {
        if (!AUTHKEY || !SMS_TEMPLATE_ID) {
            return { success: false, error: 'MSG91 SMS not configured' };
        }
        try {
            // MSG91 Flow: the DLT template contains the message body with a
            // named variable (commonly ##OTP## / {{otp}}). We pass the code as
            // `otp`; keep the template variable name in sync on the MSG91 dashboard.
            const res = await fetch(FLOW_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authkey: AUTHKEY,
                },
                body: JSON.stringify({
                    template_id: SMS_TEMPLATE_ID,
                    sender: SENDER_ID,
                    short_url: '0',
                    recipients: [{ mobiles: toIndiaMsisdn(mobile), otp: text }],
                }),
            });
            const data = await res.json();
            if (!res.ok || data?.type === 'error') {
                return {
                    success: false,
                    error: data?.message || `MSG91 SMS failed (${res.status})`,
                };
            }
            return { success: true, id: data?.request_id };
        } catch (err: any) {
            return { success: false, error: err?.message || 'MSG91 SMS error' };
        }
    },

    async sendWhatsAppTemplate(
        mobile: string,
        templateName: string,
        variables: string[],
        mediaUrl?: string
    ): Promise<SendResult> {
        if (!AUTHKEY || !WA_NUMBER) {
            return { success: false, error: 'MSG91 WhatsApp not configured' };
        }
        try {
            const components: Record<string, any> = {};
            if (mediaUrl) {
                components.header_1 = {
                    type: 'image',
                    value: mediaUrl,
                };
            }
            variables.forEach((value, i) => {
                components[`body_${i + 1}`] = { type: 'text', value };
            });

            const res = await fetch(WA_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authkey: AUTHKEY,
                },
                body: JSON.stringify({
                    integrated_number: WA_NUMBER,
                    content_type: 'template',
                    payload: {
                        messaging_product: 'whatsapp',
                        type: 'template',
                        template: {
                            name: templateName,
                            language: { code: WA_LANG, policy: 'deterministic' },
                            ...(WA_NAMESPACE ? { namespace: WA_NAMESPACE } : {}),
                            to_and_components: [
                                { to: [toIndiaMsisdn(mobile)], components },
                            ],
                        },
                    },
                }),
            });
            const data = await res.json();
            // Log the full MSG91 response so delivery issues (template not approved,
            // number not registered, etc.) are diagnosable. MSG91 returns 200 on
            // ACCEPTANCE, not delivery, so "success" here only means it queued.
            console.log(
                `[msg91:whatsapp] to=${toIndiaMsisdn(mobile)} template=${templateName} media=${!!mediaUrl} status=${res.status} resp=${JSON.stringify(data)}`,
            );
            if (!res.ok || data?.type === 'error') {
                return {
                    success: false,
                    error: data?.message || `MSG91 WhatsApp failed (${res.status})`,
                };
            }
            return { success: true, id: data?.request_id };
        } catch (err: any) {
            return { success: false, error: err?.message || 'MSG91 WhatsApp error' };
        }
    },
};
