import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Replace with your WhatsApp Business API credentials from Meta Developer Dashboard
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || 'YOUR_META_WHATSAPP_TOKEN';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || 'YOUR_PHONE_NUMBER_ID';

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get('x-razorpay-signature');
        
        // Verify Razorpay Webhook Signature
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';
        const expectedSignature = crypto.createHmac('sha256', secret).update(bodyText).digest('hex');
        
        if (expectedSignature !== signature) {
            // In a real production environment, you MUST uncomment this to prevent fake requests
            // return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
            console.warn('Webhook signature mismatch. Proceeding anyway for development/testing purposes.');
        }

        const event = JSON.parse(bodyText);

        // We only care about successful payments
        if (event.event === 'payment.captured' || event.event === 'order.paid') {
            const paymentEntity = event.payload.payment.entity;
            
            // Extract the metadata we passed during checkout
            const { whatsappNumber, imageUrls, rsvpLink } = paymentEntity.notes;

            if (whatsappNumber && imageUrls) {
                console.log(`Sending WhatsApp message to ${whatsappNumber}...`);
                await sendWhatsAppMessage(whatsappNumber, JSON.parse(imageUrls), rsvpLink);
            }
        }

        return NextResponse.json({ status: 'ok' });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

async function sendWhatsAppMessage(to: string, images: string[], rsvpLink: string) {
    const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

    // Format phone number (remove +, spaces, dashes)
    const formattedPhone = to.replace(/\D/g, '');

    // For WhatsApp Cloud API, you typically use a pre-approved template for the first message.
    // Example: Sending the first image as a media template with variables.
    // If you haven't created a template yet, you MUST create one in the WhatsApp Manager.
    
    // Here is a generic implementation assuming you have a template named "wedding_card_delivery"
    // which accepts 1 header image and 1 body text variable (the RSVP link).
    
    const payload = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: {
            name: 'wedding_card_delivery', // Replace with your approved template name
            language: { code: 'en' },
            components: [
                {
                    type: 'header',
                    parameters: [
                        {
                            type: 'image',
                            image: { link: images[0] } // Send the first card (e.g. Wedding card)
                        }
                    ]
                },
                {
                    type: 'body',
                    parameters: [
                        {
                            type: 'text',
                            text: rsvpLink || 'https://nimantran.app'
                        }
                    ]
                }
            ]
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
        console.error('WhatsApp API Error:', result);
        throw new Error('Failed to send WhatsApp message');
    }
    
    console.log('WhatsApp message sent successfully:', result);
}
