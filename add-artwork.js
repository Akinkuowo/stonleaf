const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Adding artwork with timeout...')

    // Set a timeout for the entire process
    const timeout = setTimeout(() => {
        console.error('Operation timed out after 15 seconds')
        process.exit(1)
    }, 15000)

    try {
        const product = await prisma.product.create({
            data: {
                name: 'Ethereal Dreams',
                description: 'A captivating abstract piece exploring the depths of the subconscious.',
                price: 250.00,
                category: 'Digital Art',
                imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853',
                artist: 'Antigravity AI',
                stock: 1,
                isActive: true
            }
        })
        console.log('Artwork added successfully:', product.id)
        clearTimeout(timeout)
    } catch (error) {
        console.error('Error adding artwork:', error)
        clearTimeout(timeout)
    } finally {
        await prisma.$disconnect()
    }
}

main()
