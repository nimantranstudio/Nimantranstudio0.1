import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyOtp } from '@/lib/otp';
import { toTenDigits } from '@/lib/messaging/types';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/session';
import { isDevOtpBypass } from '@/lib/auth/dev-otp-bypass';
import { OTP_MAX_VERIFY_ATTEMPTS } from '@/lib/otp-config';

const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '';

async function issueSession(user: { id: string; mobileNumber: string; role: string }) {
    const res = NextResponse.json({
        success: true,
        user: { id: user.id, mobileNumber: user.mobileNumber, role: user.role },
        isAdmin: user.role === 'admin',
    });
    const token = await createSessionToken(user);
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return res;
}

async function findOrCreateUser(mobileNumber: string) {
    const isAdmin = ADMIN_MOBILE && mobileNumber === ADMIN_MOBILE;
    let user = await prisma.user.findUnique({ where: { mobileNumber } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                mobileNumber,
                isMobileVerified: true,
                role: isAdmin ? 'admin' : 'user',
                status: 'active',
            },
        });
    } else {
        user = await prisma.user.update({
            where: { mobileNumber },
            data: {
                isMobileVerified: true,
                role: isAdmin ? 'admin' : user.role,
            },
        });
    }
    return user;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const mobileNumber = toTenDigits(body.mobileNumber || '');
        const otp = String(body.otp || '').trim();

        if (!mobileNumber || mobileNumber.length !== 10 || !otp) {
            return NextResponse.json({ error: 'Mobile number and OTP are required' }, { status: 400 });
        }

        // See src/lib/auth/dev-otp-bypass.ts — the ONLY place this check is defined.
        // TODO: REMOVE DEVELOPMENT OTP BYPASS BEFORE PRODUCTION.
        if (isDevOtpBypass(mobileNumber, otp)) {
            const user = await findOrCreateUser(mobileNumber);
            return issueSession(user);
        }

        const otpRequest = await prisma.oTPRequest.findFirst({
            where: { mobileNumber, isUsed: false, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'desc' },
        });

        if (!otpRequest) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
        }

        if (otpRequest.attemptCount >= OTP_MAX_VERIFY_ATTEMPTS) {
            return NextResponse.json(
                { error: 'Too many incorrect attempts. Please request a new code.' },
                { status: 429 }
            );
        }

        if (!verifyOtp(otp, otpRequest.otpHash)) {
            await prisma.oTPRequest.update({
                where: { id: otpRequest.id },
                data: { attemptCount: { increment: 1 } },
            });
            return NextResponse.json({ error: 'Incorrect OTP' }, { status: 400 });
        }

        await prisma.oTPRequest.update({
            where: { id: otpRequest.id },
            data: { isUsed: true },
        });

        const user = await findOrCreateUser(mobileNumber);
        return issueSession(user);
    } catch (error: any) {
        console.error('OTP Verification Error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
