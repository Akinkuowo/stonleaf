import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        console.log('Diagnostic request received:', body)

        return NextResponse.json({
            message: 'Diagnostic route working',
            received: body
        })
    } catch (error) {
        console.error('Diagnostic error:', error)
        return NextResponse.json(
            { error: 'Diagnostic route failed' },
            { status: 500 }
        )
    }
}
