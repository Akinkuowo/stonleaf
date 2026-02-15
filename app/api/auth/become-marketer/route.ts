import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, generateAffiliateCode } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json()

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // Generate unique affiliate code
        let affiliateCode = generateAffiliateCode()

        // Ensure the code is unique
        let existingMarketer = await prisma.marketer.findUnique({
            where: { affiliateCode },
        })

        while (existingMarketer) {
            affiliateCode = generateAffiliateCode()
            existingMarketer = await prisma.marketer.findUnique({
                where: { affiliateCode },
            })
        }

        // Hash password and create user with marketer profile
        const passwordHash = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                email,
                name: name || null,
                passwordHash,
                role: 'MARKETER',
                marketer: {
                    create: {
                        affiliateCode,
                        commissionRate: 0.10, // 10% commission
                        totalEarnings: 0,
                    },
                },
            },
            include: {
                marketer: true,
            },
        })

        // Generate token
        const token = generateToken({
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            country: user.country || undefined,
            role: user.role,
        })

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                marketer: user.marketer,
            },
            affiliateCode,
        })
    } catch (error) {
        console.error('Marketer registration error:', error)
        return NextResponse.json(
            { error: 'Failed to register as marketer' },
            { status: 500 }
        )
    }
}
