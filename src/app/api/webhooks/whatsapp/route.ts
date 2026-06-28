import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const mode = req.nextUrl.searchParams.get('hub.mode');
        const token = req.nextUrl.searchParams.get('hub.verify_token');
        const challenge = req.nextUrl.searchParams.get('hub.challenge');

        const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

        // Verify webhook token
        if (mode === 'subscribe' && token === verifyToken && challenge) {
            console.log('WhatsApp webhook verified successfully');
            return new NextResponse(challenge, {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
            });
        }

        console.warn('Invalid webhook verification attempt');
        return NextResponse.json({ error: 'Invalid verification token' }, { status: 403 });
    } catch (error) {
        console.error('Webhook verification error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

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
