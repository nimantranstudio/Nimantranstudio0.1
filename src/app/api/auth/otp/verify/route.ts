import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

const ADMIN_MOBILE = '8010581916'; // Updated admin number

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

            return NextResponse.json({
                success: true,
                user: {
                    id: user.id,
                    mobileNumber: user.mobileNumber,
                    role: user.role
                }
            });
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

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                mobileNumber: user.mobileNumber,
                role: user.role
            }
        });

    } catch (error: any) {
        console.error('OTP Verification Error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
