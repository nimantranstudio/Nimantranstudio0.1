import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { mobileNumber } = await request.json();

        if (!mobileNumber || mobileNumber.length < 10) {
            return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // In a real app, you'd hash the OTP. For this demo/setup, we'll store it directly 
        // but typically you'd use crypto.createHash('sha256').update(otp).digest('hex')
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

        // MOCK: Send OTP to WhatsApp/SMS
        console.log(`[AUTH] Sending OTP ${otp} to ${mobileNumber}`);

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error('OTP Send Error:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
