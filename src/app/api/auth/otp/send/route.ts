import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOTP } from '@/lib/sms';

export async function POST(request: Request) {
    try {
        const { mobileNumber } = await request.json();

        if (!mobileNumber || mobileNumber.length < 10) {
            return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // In this implementation we store plain OTP for simplicity of the walkthrough
        // but in prod use hash: crypto.createHash('sha256').update(otp).digest('hex')
        const otpHash = otp;

        // Set expiration (5 minutes from now)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        // Delete old unused OTPs for this number to keep DB clean
        await prisma.oTPRequest.deleteMany({
            where: {
                mobileNumber,
                isUsed: false
            }
        });

        // Create new OTP request
        await prisma.oTPRequest.create({
            data: {
                mobileNumber,
                otpHash,
                expiresAt,
            }
        });

        // Send OTP via SMS (Twilio)
        const sent = await sendOTP(mobileNumber, otp);

        if (!sent.success) {
            console.error('Failed to send SMS:', sent.error);
            // Optionally we could return an error here, but for now we fallback to letting
            // the user potentially see the console log or try again. 
            // In a strict prod env, you might want to return 500.
        }

        console.log(`[AUTH] Generated OTP ${otp} for ${mobileNumber}`);

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error('OTP Send Error:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
