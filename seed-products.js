const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Checking for products...')
    try {
        const productCount = await prisma.product.count()
        console.log('Current product count:', productCount)

        if (productCount === 0) {
            console.log('No products found. Seeding sample products...')
            const sampleProducts = [
                {
                    name: 'Sunset Canvas',
                    description: 'A beautiful sunset over the mountains.',
                    price: 150.00,
                    category: 'Canvas Art',
                    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
                    artist: 'Jane Doe',
                    stock: 5,
                    isActive: true
                },
                {
                    name: 'Urban Photography',
                    description: 'Black and white street photography.',
                    price: 85.00,
                    category: 'Photo Art',
                    imageUrl: 'https://images.unsplash.com/photo-1449156059431-787c5d72830d',
                    artist: 'John Smith',
                    stock: 10,
                    isActive: true
                },
                {
                    name: 'Digital Abstract',
                    description: 'Vibrant digital abstract pattern.',
                    price: 120.00,
                    category: 'Digital Art',
                    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
                    artist: 'Alice Wonder',
                    stock: 3,
                    isActive: true
                }
            ]

            for (const p of sampleProducts) {
                await prisma.product.create({ data: p })
            }
            console.log('Sample products seeded successfully.')
        } else {
            const products = await prisma.product.findMany()
            console.log('Existing products:', products.map(p => p.name).join(', '))
        }

    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
