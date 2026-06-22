import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = 'INR', receipt, notes } = await req.json();

        // Initialize Razorpay
        // Note: In production, these should be securely stored in environment variables (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
        });

        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: notes || {}
        };

        const order = await instance.orders.create(options);

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
