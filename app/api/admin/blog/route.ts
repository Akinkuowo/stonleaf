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

        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Admin blog GET error:', error);
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
        const { title, slug, excerpt, content, coverImage, category, published } = body;

        if (!title || !slug || !content) {
            return NextResponse.json({ error: 'Title, slug and content are required' }, { status: 400 });
        }

        // Check if slug already exists
        const existingPost = await prisma.post.findUnique({
            where: { slug }
        });

        if (existingPost) {
            return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
        }

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                imageUrl: coverImage, // Use imageUrl as per schema
            }
        });

        return NextResponse.json({ post }, { status: 201 });
    } catch (error) {
        console.error('Admin blog POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
