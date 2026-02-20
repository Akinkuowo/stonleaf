import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        console.log('Fetching artwork detail for ID:', id)

        const artwork = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                category: true,
                imageUrl: true,
                artist: true,
                stock: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        if (!artwork) {
            return NextResponse.json(
                { error: 'Artwork not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(artwork)
    } catch (error: any) {
        console.error('Get single artwork error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        )
    }
}
