import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const user = verifyToken(token);

        if (!user || !isAdmin(user)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Admin products GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const user = verifyToken(token);

        if (!user || !isAdmin(user)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { name, description, basePrice, gainFee, price, category, imageUrl, gallery, colors, artist, stock, isActive } = body;

        if (!name || price === undefined || !category) {
            return NextResponse.json({ error: 'Name, price and category are required' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                basePrice: parseFloat(basePrice) || 0,
                gainFee: parseFloat(gainFee) || 0,
                price: parseFloat(price),
                category,
                imageUrl,
                gallery: gallery || [],
                colors: colors || [],
                artist,
                stock: parseInt(stock) || 0,
                isActive: isActive !== undefined ? isActive : true
            }
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error) {
        console.error('Admin products POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
