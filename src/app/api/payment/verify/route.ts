import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const secret = 'veoV7kslZmD9h74Bvih6ummX';
        
        // Create signature string
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // Payment is successful and verified
            // TODO: Update database (mark bundle as paid, etc.)

            // Find the order that corresponds to this payment
            // We use the Razorpay order ID to match or find the order
            try {
                const { prisma } = await import('@/lib/prisma');
                const order = await prisma.order.findFirst({
                    where: { id: razorpay_order_id }
                });
                
                if (order) {
                    await prisma.order.update({
                        where: { id: order.id },
                        data: { status: 'paid' }
                    });

                    // Trigger the video render generation asynchronously
                    const renderUrl = `${req.nextUrl.origin}/api/videos/render`;
                    fetch(renderUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderId: order.id })
                    }).catch(err => {
                        console.error('Failed to trigger video render in background:', err);
                    });
                }
            } catch (dbErr) {
                console.error('Error updating order state or triggering render:', dbErr);
            }
            
            return NextResponse.json({ success: true, message: 'Payment verified successfully' });
        } else {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Error verifying Razorpay signature:', error);
        return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
    }
}
