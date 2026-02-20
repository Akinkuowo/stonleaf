import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createProdigiOrder, ProdigiOrderRequest } from '@/lib/prodigi';

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

        const body = await req.json();
        const { recipient, items, shippingMethod } = body;

        if (!recipient || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing recipient or items' }, { status: 400 });
        }

        // Format items for Prodigi
        const prodigiItems = items.map((item: any) => ({
            sku: item.sku || 'GLOBAL-FAP-16x24', // Default SKU if not provided
            quantity: item.quantity || 1,
            assets: [
                {
                    printArea: 'default',
                    url: item.image,
                },
            ],
        }));

        const orderData: ProdigiOrderRequest = {
            recipient,
            items: prodigiItems,
            shippingMethod: shippingMethod || 'Budget',
        };

        const result = await createProdigiOrder(orderData);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Prodigi Order API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
