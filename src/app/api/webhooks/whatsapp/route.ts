import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * Verifies Meta's X-Hub-Signature-256 header — HMAC-SHA256 of the raw request
 * body, keyed by the WhatsApp/Meta app secret. Standard verification for every
 * Meta webhook receiver; without it, this endpoint would accept and process
 * any POSTed JSON as if it genuinely came from Meta (message-status spoofing).
 * Constant-time compare so the check itself can't leak the secret via timing.
 */
function isValidWebhookSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
    if (!signatureHeader) return false;
    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    const expectedBuf = Buffer.from(expected);
    const givenBuf = Buffer.from(signatureHeader);
    if (expectedBuf.length !== givenBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, givenBuf);
}

export async function GET(req: NextRequest) {
    try {
        const mode = req.nextUrl.searchParams.get('hub.mode');
        const token = req.nextUrl.searchParams.get('hub.verify_token');
        const challenge = req.nextUrl.searchParams.get('hub.challenge');

        const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

        // If accessed directly via browser without parameters
        if (!mode && !token && !challenge) {
            return NextResponse.json({
                status: 'online',
                message: 'WhatsApp Webhook endpoint is active and listening for Meta verification requests.',
                configured: !!verifyToken
            }, { status: 200 });
        }

        // Verify webhook token
        if (mode === 'subscribe' && challenge) {
            if (!verifyToken) {
                console.error('WhatsApp Webhook verification failed: WHATSAPP_VERIFY_TOKEN is not defined in server environment variables.');
                return NextResponse.json({ 
                    error: 'Server configuration error: verification token not configured.' 
                }, { status: 500 });
            }

            if (token === verifyToken) {
                console.log('WhatsApp webhook verified successfully');
                return new NextResponse(challenge, {
                    status: 200,
                    headers: { 'Content-Type': 'text/plain' }
                });
            } else {
                console.warn(`WhatsApp Webhook verification failed: Token mismatch. Expected: ${verifyToken.substring(0, 3)}... (length: ${verifyToken.length}), Received: ${token ? (token.substring(0, 3) + '... (length: ' + token.length + ')') : 'null'}`);
                return NextResponse.json({ error: 'Invalid verification token' }, { status: 403 });
            }
        }

        console.warn('Invalid webhook verification parameters');
        return NextResponse.json({ error: 'Invalid verification request parameters' }, { status: 400 });
    } catch (error) {
        console.error('Webhook verification error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        // Read the raw body text (not req.json()) so the exact bytes Meta
        // signed are what gets verified — re-serializing a parsed object
        // isn't guaranteed to match byte-for-byte.
        const rawBody = await req.text();
        const appSecret = process.env.WHATSAPP_APP_SECRET;

        if (appSecret) {
            const signature = req.headers.get('x-hub-signature-256');
            if (!isValidWebhookSignature(rawBody, signature, appSecret)) {
                console.warn('WhatsApp webhook: invalid or missing X-Hub-Signature-256 — rejecting request.');
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
        } else {
            // Matches this codebase's existing pattern for a missing secret
            // (see resolveSessionSecret) — fail loud in logs rather than
            // silently accepting unverified webhook payloads with no trace.
            console.error(
                '[SECURITY] WHATSAPP_APP_SECRET is not set — this webhook is accepting POST ' +
                'payloads WITHOUT verifying they actually came from Meta. Set WHATSAPP_APP_SECRET ' +
                '(the WhatsApp/Meta app secret) to close this gap.'
            );
        }

        const body = JSON.parse(rawBody);

        console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2));

        // Handle incoming webhooks from Meta
        if (body.object === 'whatsapp_business_account') {
            const changes = body.entry?.[0]?.changes || [];

            for (const change of changes) {
                const { field, value } = change;

                if (field === 'messages') {
                    // Handle incoming messages (message status updates, read receipts, etc.)
                    const statuses = value?.statuses || [];
                    const messages = value?.messages || [];

                    // Process message statuses (delivered, read, failed)
                    for (const status of statuses) {
                        console.log(`Message ${status.id} status: ${status.status}`);

                        // Store status in database if needed
                        if (status.id && status.status) {
                            try {
                                await prisma.wHatsAppMessage.upsert({
                                    where: { messageId: status.id },
                                    update: { status: status.status },
                                    create: {
                                        messageId: status.id,
                                        status: status.status,
                                        timestamp: new Date(parseInt(status.timestamp) * 1000)
                                    }
                                });
                            } catch (e) {
                                console.error('Error storing message status:', e);
                            }
                        }
                    }

                    // Process incoming messages (if any)
                    for (const message of messages) {
                        console.log(`Incoming message from ${message.from}: ${message.id}`);
                        // You can process incoming messages here if needed
                    }
                }
            }

            return NextResponse.json({ success: true }, { status: 200 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
    }
}
