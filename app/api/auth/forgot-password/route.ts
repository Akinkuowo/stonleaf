import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        // For security reasons, don't reveal if user exists or not
        if (!user) {
            return NextResponse.json({ message: 'If an account exists with that email, a reset link has been sent.' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expiry to 1 hour from now
        const expiry = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: resetTokenHash,
                resetTokenExpiry: expiry,
            },
        });

        // In a real app, send an email. For now, we return it in the response for development.
        const resetUrl = `${new URL(req.url).origin}/reset-password?token=${resetToken}&email=${email}`;

        console.log('Password reset URL:', resetUrl);

        return NextResponse.json({
            message: 'If an account exists with that email, a reset link has been sent.',
            // IMPORTANT: Only return this for development/demo purposes
            debugResetUrl: resetUrl,
        });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
