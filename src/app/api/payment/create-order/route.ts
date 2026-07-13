import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
    try {
        console.log('Creating Razorpay order...');
        const body = await req.json();
        const { bundleId, amount, currency = 'INR' } = body;

        console.log('Request body:', { bundleId, amount, currency });

        if (!amount || amount < 100) {
            const msg = 'Amount must be at least 100 paise (₹1)';
            console.warn(msg);
            return NextResponse.json({ error: msg }, { status: 400 });
        }

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            const msg = 'Razorpay credentials not configured';
            console.error(msg, { keyId: !!keyId, keySecret: !!keySecret });
            return NextResponse.json({ error: msg }, { status: 500 });
        }

        console.log('Razorpay credentials present');

        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        const options = {
            amount: amount,
            currency: currency,
            receipt: `receipt_${bundleId || Date.now()}`,
        };

        console.log('Creating order with options:', options);
        const order = await razorpay.orders.create(options);

        console.log('Order created successfully:', order.id);

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: keyId
        });
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);

        if (error.statusCode === 401) {
            return NextResponse.json({ error: 'Razorpay authentication failed - check credentials' }, { status: 401 });
        }

        return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
    }
}
