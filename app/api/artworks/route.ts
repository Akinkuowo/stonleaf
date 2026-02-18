import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get('q') || ''
        const category = searchParams.get('category')
        const artist = searchParams.get('artist')
        const minPrice = parseFloat(searchParams.get('minPrice') || '0')
        const maxPrice = parseFloat(searchParams.get('maxPrice') || '0')
        const inStock = searchParams.get('inStock') === 'true'
        const limit = parseInt(searchParams.get('limit') || '12')
        const page = parseInt(searchParams.get('page') || '1')
        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {
            isActive: true,
        }

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { artist: { contains: query, mode: 'insensitive' } },
            ]
        }

        if (category) {
            where.category = category
        }

        if (artist) {
            where.artist = { contains: artist, mode: 'insensitive' }
        }

        if (minPrice > 0 || maxPrice > 0) {
            where.price = {
                ...(minPrice > 0 && { gte: minPrice }),
                ...(maxPrice > 0 && { lte: maxPrice }),
            }
        }

        if (inStock) {
            where.stock = { gt: 0 }
        }

        // Fetch artworks and total count in parallel
        const [artworks, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    category: true,
                    imageUrl: true,
                    artist: true,
                    stock: true,
                    createdAt: true,
                },
            }),
            prisma.product.count({ where }),
        ])

        return NextResponse.json({
            artworks,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error: any) {
        console.error('Get artworks error - Full details:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            meta: error.meta
        })
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        )
    }
}