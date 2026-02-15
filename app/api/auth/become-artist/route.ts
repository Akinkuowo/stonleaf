import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, bio, portfolioUrl, instagramHandle } = await req.json()

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

        // Hash password and create user with artist profile
        const passwordHash = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                email,
                name: name || null,
                passwordHash,
                role: 'ARTIST',
                artist: {
                    create: {
                        bio: bio || null,
                        portfolioUrl: portfolioUrl || null,
                        instagramHandle: instagramHandle || null,
                    },
                },
            },
            include: {
                artist: true,
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
                artist: user.artist,
            },
        })
    } catch (error) {
        console.error('Artist registration error:', error)
        return NextResponse.json(
            { error: 'Failed to register as artist' },
            { status: 500 }
        )
    }
}
