import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeAndReceipt } from '@/lib/notifications';

/**
 * DEV-ONLY: trigger the post-payment WhatsApp welcome without a real Razorpay
 * payment, so the localhost mock-payment flow can exercise the message end to end.
 * Returns the actual MSG91 result so the tester sees delivery success or the error.
 * Hard-disabled outside development.
 */
export async function POST(req: NextRequest) {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not available' }, { status: 404 });
    }
    try {
        const { mobile, coupleNames, heroImageUrl } = await req.json();
        if (!mobile || String(mobile).replace(/\D/g, '').length < 10) {
            return NextResponse.json({ success: false, error: 'A 10-digit mobile is required' }, { status: 400 });
        }
        const result = await sendWelcomeAndReceipt({
            mobile: String(mobile),
            coupleNames: coupleNames || '',
            amountRupees: 10,
            orderId: `mock-${Date.now()}`,
            heroImageUrl: typeof heroImageUrl === 'string' ? heroImageUrl : undefined,
        });
        return NextResponse.json({ ...result, heroSent: !!heroImageUrl });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error?.message || 'failed' }, { status: 500 });
    }
}
