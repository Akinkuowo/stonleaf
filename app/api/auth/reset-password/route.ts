import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { token, email, newPassword } = await req.json();

        if (!token || !email || !newPassword) {
            return NextResponse.json({ error: 'Token, email, and new password are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.resetToken || !user.resetTokenExpiry) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Verify expiry
        if (new Date() > user.resetTokenExpiry) {
            return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
        }

        // Verify token hash
        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        if (tokenHash !== user.resetToken) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update user
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({ message: 'Password has been reset successfully.' });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
