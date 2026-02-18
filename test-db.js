const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
})

async function testConnection() {
    console.log('Starting DB connection test...')

    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database connection timed out after 10 seconds')), 10000)
    })

    try {
        const result = await Promise.race([
            prisma.$connect().then(() => 'Connected!'),
            timeoutPromise
        ])
        console.log(result)

        const count = await prisma.product.count()
        console.log('Product count:', count)

    } catch (err) {
        console.error('Connection failed:', err.message)
    } finally {
        await prisma.$disconnect()
        process.exit(0)
    }
}

testConnection()
