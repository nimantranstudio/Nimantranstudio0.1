import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_MOBILE = '8884678194'; // Updated admin number

export async function POST(request: Request) {
    try {
        const { mobileNumber, otp } = await request.json();

        if (!mobileNumber || !otp) {
            return NextResponse.json({ error: 'Mobile number and OTP are required' }, { status: 400 });
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

        const isUserAdmin = mobileNumber === ADMIN_MOBILE;

        // Find or Create User using Upsert for atomicity and performance
        const user = await prisma.user.upsert({
            where: { mobileNumber },
            create: {
                mobileNumber,
                isMobileVerified: true,
                role: isUserAdmin ? 'admin' : 'user',
                status: 'active'
            },
            update: {
                isMobileVerified: true,
                ...(isUserAdmin ? { role: 'admin' } : {})
            }
        });

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
