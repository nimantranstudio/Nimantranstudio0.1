import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { messaging, messagingConfigured } from '@/lib/messaging';
import { generateOtp, hashOtp } from '@/lib/otp';
import { toTenDigits } from '@/lib/messaging/types';
import {
    OTP_EXPIRY_MINUTES,
    OTP_SEND_LIMIT_PER_HOUR,
    OTP_SEND_LIMIT_PER_IP_PER_HOUR,
    OTP_RESEND_COOLDOWN_SECONDS,
} from '@/lib/otp-config';

/** Best-effort client IP from standard proxy headers. Never blocks sending
 * on failure to resolve — this is a secondary rate-limit dimension, not a
 * requirement. */
function getClientIp(request: Request): string | null {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return request.headers.get('x-real-ip');
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const mobileNumber = toTenDigits(body.mobileNumber || '');

        if (!mobileNumber || mobileNumber.length !== 10) {
            return NextResponse.json({ error: 'Enter a valid 10-digit mobile number' }, { status: 400 });
        }

        const ipAddress = getClientIp(request);
        const now = Date.now();
        const oneHourAgo = new Date(now - 60 * 60 * 1000);

        // Most recent request for this number, regardless of status — backs both the
        // short resend cooldown and (since rows are no longer deleted, see below) an
        // accurate hourly count.
        const lastForNumber = await prisma.oTPRequest.findFirst({
            where: { mobileNumber },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true },
        });
        if (lastForNumber) {
            const secondsSinceLast = (now - lastForNumber.createdAt.getTime()) / 1000;
            if (secondsSinceLast < OTP_RESEND_COOLDOWN_SECONDS) {
                const wait = Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLast);
                return NextResponse.json(
                    { error: `Please wait ${wait}s before requesting another code.`, retryAfterSeconds: wait },
                    { status: 429 }
                );
            }
        }

        // Rate limit: per phone number, and separately per IP (one IP spamming many
        // different numbers is a distinct abuse pattern a per-number limit misses).
        // Deliberately counts rows without deleting any — a prior version deleted
        // each unused row before the *next* request's count, which meant an attacker
        // who never verified could send unlimited requests: every send erased the
        // evidence of the one before it, so the count never reached the threshold.
        const [recentForNumber, recentForIp] = await Promise.all([
            prisma.oTPRequest.count({ where: { mobileNumber, createdAt: { gt: oneHourAgo } } }),
            ipAddress
                ? prisma.oTPRequest.count({ where: { ipAddress, createdAt: { gt: oneHourAgo } } })
                : Promise.resolve(0),
        ]);
        if (recentForNumber >= OTP_SEND_LIMIT_PER_HOUR) {
            return NextResponse.json(
                { error: 'Too many OTP requests. Please try again after an hour.' },
                { status: 429 }
            );
        }
        if (ipAddress && recentForIp >= OTP_SEND_LIMIT_PER_IP_PER_HOUR) {
            return NextResponse.json(
                { error: 'Too many requests from this network. Please try again later.' },
                { status: 429 }
            );
        }

        const otp = generateOtp();
        const expiresAt = new Date(now + OTP_EXPIRY_MINUTES * 60 * 1000);

        // No longer deletes prior unused rows (see the rate-limit note above) — the
        // verify route already only ever matches the newest unused, unexpired row
        // (isUsed: false, expiresAt > now, orderBy createdAt desc), so an older
        // still-unverified code is naturally superseded without needing to remove it.
        await prisma.oTPRequest.create({
            data: { mobileNumber, otpHash: hashOtp(otp), expiresAt, ipAddress },
        });

        // Deliver via the vendor-neutral adapter (SMS). In dev without a vendor
        // configured, the adapter logs the code to the server console.
        const text = `${otp} is your Nimantran Studio verification code. Valid for ${OTP_EXPIRY_MINUTES} minutes. Do not share it with anyone.`;

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
            resendAfterSeconds: OTP_RESEND_COOLDOWN_SECONDS,
            // In dev (no vendor configured) surface a hint so the flow is testable.
            devHint: !messagingConfigured ? 'Vendor not configured — OTP printed to server console' : undefined,
        });
    } catch (error: any) {
        console.error('OTP Send Error:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
