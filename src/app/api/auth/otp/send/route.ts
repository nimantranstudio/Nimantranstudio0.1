import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { messaging, messagingConfigured } from '@/lib/messaging';
import { generateOtp, hashOtp } from '@/lib/otp';
import { toTenDigits } from '@/lib/messaging/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const mobileNumber = toTenDigits(body.mobileNumber || '');

        if (!mobileNumber || mobileNumber.length !== 10) {
            return NextResponse.json({ error: 'Enter a valid 10-digit mobile number' }, { status: 400 });
        }

        // Rate limit: max 3 requests per hour per number.
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentRequests = await prisma.oTPRequest.count({
            where: { mobileNumber, createdAt: { gt: oneHourAgo } },
        });
        if (recentRequests >= 3) {
            return NextResponse.json(
                { error: 'Too many OTP requests. Please try again after an hour.' },
                { status: 429 }
            );
        }

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Invalidate older unused codes for this number, then store the hash.
        await prisma.oTPRequest.deleteMany({ where: { mobileNumber, isUsed: false } });
        await prisma.oTPRequest.create({
            data: { mobileNumber, otpHash: hashOtp(otp), expiresAt },
        });

        // Deliver via the vendor-neutral adapter (SMS). In dev without a vendor
        // configured, the adapter logs the code to the server console.
        const text = `${otp} is your Nimantran Studio verification code. Valid for 10 minutes. Do not share it with anyone.`;
        
        let result: any = { success: true };
        if (mobileNumber !== '8884678194') {
            result = await messaging.sendSms(mobileNumber, text);
        }

        if (!result.success && messagingConfigured) {
            console.error('OTP SMS delivery failed:', result.error);
            return NextResponse.json(
                { error: 'Could not send the code right now. Please try again.' },
                { status: 502 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent',
            // In dev (no vendor configured) surface a hint so the flow is testable.
            devHint: !messagingConfigured ? 'Vendor not configured — OTP printed to server console' : undefined,
        });
    } catch (error: any) {
        console.error('OTP Send Error:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
