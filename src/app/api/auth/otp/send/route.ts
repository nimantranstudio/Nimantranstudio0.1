import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOTP } from '@/lib/sms';
import { sendWhatsAppOTP } from '@/lib/whatsapp';

export async function POST(request: Request) {
    try {
        const { mobileNumber } = await request.json();

        if (!mobileNumber || mobileNumber.length < 10) {
            return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 });
        }

        // Rate limiting: max 3 requests per hour per number
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentRequests = await prisma.oTPRequest.count({
            where: {
                mobileNumber,
                createdAt: { gt: oneHourAgo }
            }
        });

        if (recentRequests >= 3) {
            return NextResponse.json(
                { error: 'Too many OTP requests. Please try again after 1 hour.' },
                { status: 429 }
            );
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP hash (in production use bcrypt)
        const otpHash = otp;

        // Set expiration (10 minutes from now)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Delete old unused OTPs for this number to keep DB clean
        await prisma.oTPRequest.deleteMany({
            where: {
                mobileNumber,
                isUsed: false
            }
        });

        // Create new OTP request
        const otpRequest = await prisma.oTPRequest.create({
            data: {
                mobileNumber,
                otpHash,
                expiresAt,
            }
        });

        console.log(`[AUTH] Generated OTP ${otp} for ${mobileNumber}`);

        // Try WhatsApp first (primary method)
        const whatsappResult = await sendWhatsAppOTP(mobileNumber, otp);

        if (whatsappResult.success) {
            // Store WhatsApp message ID if available
            if (whatsappResult.messageId) {
                await prisma.oTPRequest.update({
                    where: { id: otpRequest.id },
                    data: { messageId: whatsappResult.messageId }
                });
            }
            return NextResponse.json({
                success: true,
                message: 'OTP sent to your WhatsApp',
                method: 'whatsapp'
            });
        }

        // Fallback to SMS if WhatsApp fails
        console.warn('WhatsApp OTP failed, falling back to SMS:', whatsappResult.error);
        const smsResult = await sendOTP(mobileNumber, otp);

        if (!smsResult.success) {
            console.error('Both WhatsApp and SMS OTP delivery failed');
            return NextResponse.json(
                { error: 'Failed to send OTP. Please try again.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent via SMS',
            method: 'sms'
        });
    } catch (error: any) {
        console.error('OTP Send Error:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
