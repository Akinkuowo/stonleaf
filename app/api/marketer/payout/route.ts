import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
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

        const marketer = await prisma.marketer.findUnique({
            where: { userId: payload.id },
            include: {
                transactions: true,
                payoutRequests: true,
            },
        })

        if (!marketer) {
            return NextResponse.json({ error: 'Marketer profile not found' }, { status: 404 })
        }

        // Calculate available balance
        const totalCommission = marketer.transactions.reduce((sum, t) => sum + t.commission, 0)
        const paidOut = marketer.payoutRequests
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0)
        const pendingPayouts = marketer.payoutRequests
            .filter(p => p.status === 'pending')
            .reduce((sum, p) => sum + p.amount, 0)
        const availableBalance = totalCommission - paidOut - pendingPayouts

        const body = await request.json()
        const { amount } = body

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid payout amount' }, { status: 400 })
        }

        if (amount < 10) {
            return NextResponse.json({ error: 'Minimum payout amount is $10.00' }, { status: 400 })
        }

        if (amount > availableBalance) {
            return NextResponse.json(
                { error: `Insufficient balance. Available: $${availableBalance.toFixed(2)}` },
                { status: 400 }
            )
        }

        // Create payout request
        const payoutRequest = await prisma.payoutRequest.create({
            data: {
                marketerId: marketer.id,
                amount,
                status: 'pending',
            },
        })

        return NextResponse.json({
            payoutRequest,
            availableBalance: availableBalance - amount,
        })
    } catch (error) {
        console.error('Payout API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
