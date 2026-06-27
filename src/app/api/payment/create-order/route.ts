import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { bundleId, amount, currency = 'INR' } = body;

        if (!amount || amount < 100) {
            return NextResponse.json({ error: 'Amount must be at least 100 paise (₹1)' }, { status: 400 });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || '',
        });

        const options = {
            amount: amount, // amount in the smallest currency unit (paise)
            currency: currency,
            receipt: `receipt_${bundleId || Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        
        if (error.statusCode === 401) {
            return NextResponse.json({ error: 'Razorpay authentication failed' }, { status: 401 });
        }
        
        return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
    }
}
