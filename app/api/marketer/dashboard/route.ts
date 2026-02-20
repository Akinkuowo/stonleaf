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

        // Get marketer profile with transactions and payouts
        const marketer = await prisma.marketer.findUnique({
            where: { userId: payload.id },
            include: {
                transactions: {
                    include: {
                        order: {
                            select: {
                                id: true,
                                status: true,
                                createdAt: true,
                                user: {
                                    select: { name: true, email: true }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
                payoutRequests: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        })

        if (!marketer) {
            return NextResponse.json({ error: 'Marketer profile not found' }, { status: 404 })
        }

        // Calculate stats
        const totalReferrals = marketer.transactions.length
        const totalSalesAmount = marketer.transactions.reduce((sum, t) => sum + t.orderAmount, 0)
        const totalCommission = marketer.transactions.reduce((sum, t) => sum + t.commission, 0)
        const paidOut = marketer.payoutRequests
            .filter(p => p.status === 'paid')
            .reduce((sum, p) => sum + p.amount, 0)
        const pendingPayout = totalCommission - paidOut

        // Monthly earnings for the last 6 months
        const now = new Date()
        const monthlyEarnings = []
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59)
            const monthLabel = monthStart.toLocaleString('default', { month: 'short' })

            const monthCommission = marketer.transactions
                .filter(t => {
                    const d = new Date(t.createdAt)
                    return d >= monthStart && d <= monthEnd
                })
                .reduce((sum, t) => sum + t.commission, 0)

            monthlyEarnings.push({ month: monthLabel, earnings: monthCommission })
        }

        return NextResponse.json({
            marketer: {
                id: marketer.id,
                affiliateCode: marketer.affiliateCode,
                commissionRate: marketer.commissionRate,
                totalEarnings: marketer.totalEarnings,
                clickCount: marketer.clickCount,
            },
            stats: {
                totalReferrals,
                totalSalesAmount,
                totalCommission,
                pendingPayout,
            },
            monthlyEarnings,
            transactions: marketer.transactions.map(t => ({
                id: t.id,
                orderId: t.orderId,
                commission: t.commission,
                orderAmount: t.orderAmount,
                status: t.status,
                createdAt: t.createdAt,
                customerName: t.order.user?.name || 'Anonymous',
            })),
            payoutRequests: marketer.payoutRequests,
        })
    } catch (error) {
        console.error('Dashboard API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
