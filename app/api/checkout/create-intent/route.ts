import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-11.acacia' as any,
});

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get cart items from DB instead of relying solely on client
        const cartItems = await prisma.cart.findMany({
            where: { userId: payload.id },
            include: { product: true },
        });

        if (cartItems.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // Calculate total amount in cents
        const totalAmount = cartItems.reduce((acc, item) => {
            return acc + item.product.price * item.quantity;
        }, 0);

        const amountInCents = Math.round(totalAmount * 100);

        // Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            metadata: {
                userId: payload.id,
                itemCount: cartItems.length.toString(),
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            amount: totalAmount,
        });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
