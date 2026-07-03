import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createAdminToken, ADMIN_COOKIE } from '@/lib/admin-session';

// Only this number gets admin access. Configurable via env; defaults to the owner's number.
const ADMIN_MOBILE = process.env.ADMIN_MOBILE || '8884678194';

// Build a success response and attach a signed admin cookie for admins only.
async function successResponse(user: { id: string; mobileNumber: string; role: string }) {
    const response = NextResponse.json({
        success: true,
        user: { id: user.id, mobileNumber: user.mobileNumber, role: user.role },
    });
    if (user.role === 'admin') {
        const token = await createAdminToken(user.mobileNumber);
        response.cookies.set(ADMIN_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 86400,
        });
    }
    return response;
}

export async function POST(request: Request) {
    try {
        const { mobileNumber, otp } = await request.json();

        if (!mobileNumber || !otp) {
            return NextResponse.json({ error: 'Mobile number and OTP are required' }, { status: 400 });
        }

        // Hardcoded bypass for the guest account and admin account
        if (
            (mobileNumber === '8087084358' && otp === '422101') ||
            (mobileNumber === ADMIN_MOBILE && otp === '422101')
        ) {
            let user = await prisma.user.findUnique({
                where: { mobileNumber }
            });

            const isUserAdmin = mobileNumber === ADMIN_MOBILE;

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        mobileNumber,
                        isMobileVerified: true,
                        role: isUserAdmin ? 'admin' : 'guest',
                        status: 'active'
                    }
                });
            } else {
                user = await prisma.user.update({
                    where: { mobileNumber },
                    data: {
                        isMobileVerified: true,
                        role: isUserAdmin ? 'admin' : user.role // keep guest or existing role
                    }
                });
            }

            return await successResponse(user);
        }

        // Find the latest valid OTP request
        const otpRequest = await prisma.oTPRequest.findFirst({
            where: {
                mobileNumber,
                isUsed: false,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!otpRequest) {
            return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
        }

        // Verify OTP (Check against hash if using hashing, here we check directly for simplicity)
        if (otpRequest.otpHash !== otp) {
            // Increment attempt count
            await prisma.oTPRequest.update({
                where: { id: otpRequest.id },
                data: { attemptCount: { increment: 1 } }
            });
            return NextResponse.json({ error: 'Incorrect OTP' }, { status: 400 });
        }

        // Mark OTP as used
        await prisma.oTPRequest.update({
            where: { id: otpRequest.id },
            data: { isUsed: true }
        });

        // Find or Create User
        let user = await prisma.user.findUnique({
            where: { mobileNumber }
        });

        const isUserAdmin = mobileNumber === ADMIN_MOBILE;

        if (!user) {
            user = await prisma.user.create({
                data: {
                    mobileNumber,
                    isMobileVerified: true,
                    role: isUserAdmin ? 'admin' : 'user',
                    status: 'active'
                }
            });
        } else {
            // Update verified status and role if it's the admin number
            user = await prisma.user.update({
                where: { mobileNumber },
                data: {
                    isMobileVerified: true,
                    role: isUserAdmin ? 'admin' : user.role // Keep existing role unless it's the designated admin number
                }
            });
        }

        return await successResponse(user);

    } catch (error: any) {
        console.error('OTP Verification Error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
