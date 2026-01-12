
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const products = [
    {
      name: 'CLAY SYMMETRY',
      description: 'Abstract clay symmetry art.',
      price: 445,
      category: 'Canvas Art',
      imageUrl: '/images/artwork.webp',
      stock: 10,
    },
    {
      name: 'BEL-AIR VILLA',
      description: 'Scenic view of a Bel-Air villa.',
      price: 595,
      category: 'Photo Art',
      imageUrl: '/images/artwork_2.webp',
      stock: 5,
    },
    {
      name: 'AFTERGLOW',
      description: 'Reflective disco balls pattern.',
      price: 495,
      category: 'Digital Art',
      imageUrl: '/images/arkwork_3.jpg',
      stock: 8,
    },
    {
      name: 'MOUNTAIN VISTA',
      description: 'Serene mountain landscape.',
      price: 550,
      category: 'Photo Art',
      imageUrl: '/images/artwork_4.jpg',
      stock: 12,
    },
    {
      name: 'URBAN JUNGLE',
      description: 'City life meets nature.',
      price: 480,
      category: 'Digital Art',
      imageUrl: '/images/arkwork_5.webp',
      stock: 7,
    },
    {
      name: 'GOLDEN HOUR',
      description: 'Sunset over the horizon.',
      price: 600,
      category: 'Canvas Art',
      imageUrl: '/images/artwork_6.jpg',
      stock: 3,
    },
    {
      name: 'ABSTRACT WAVES',
      description: 'Fluid motion captured in art.',
      price: 520,
      category: 'Abstract',
      imageUrl: '/images/artwork_7.jpg',
      stock: 9,
    },
    {
      name: 'VINTAGE PORTRAIT',
      description: 'Classic portrait style.',
      price: 460,
      category: 'Photo Art',
      imageUrl: '/images/artwork_8.jpeg',
      stock: 6,
    }
  ]

  console.log('Seeding products...')

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: product,
    })
    console.log(`Created product with id: ${createdProduct.id}`)
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })