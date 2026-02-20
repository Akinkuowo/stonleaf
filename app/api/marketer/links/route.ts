import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.substring(7)
        const payload = verifyToken(token)

        if (!payload || payload.role !== 'MARKETER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get marketer profile
        const marketer = await prisma.marketer.findUnique({
            where: { userId: payload.id },
        })

        if (!marketer) {
            return NextResponse.json({ error: 'Marketer profile not found' }, { status: 404 })
        }

        // Get products for the link generator
        const products = await prisma.product.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                category: true,
                price: true,
                imageUrl: true,
            },
            orderBy: { name: 'asc' },
        })

        // Build the base URL from the request
        const protocol = request.headers.get('x-forwarded-proto') || 'http'
        const host = request.headers.get('host') || 'localhost:3000'
        const baseUrl = `${protocol}://${host}`

        const affiliateLink = `${baseUrl}/shop?ref=${marketer.affiliateCode}`

        // Build product-specific links
        const productId = request.nextUrl.searchParams.get('productId')
        let productLink = null
        if (productId) {
            productLink = `${baseUrl}/artwork/${productId}?ref=${marketer.affiliateCode}`
        }

        return NextResponse.json({
            affiliateCode: marketer.affiliateCode,
            affiliateLink,
            productLink,
            products,
        })
    } catch (error) {
        console.error('Links API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
