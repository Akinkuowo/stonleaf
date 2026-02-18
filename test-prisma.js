const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Testing Prisma connection...')
    try {
        const userCount = await prisma.user.count()
        console.log('Current user count:', userCount)

        // Try to find a user
        const user = await prisma.user.findFirst()
        console.log('First user found:', user ? user.email : 'None')

    } catch (error) {
        console.error('Prisma test error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
