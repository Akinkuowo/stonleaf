
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding blog posts...')

    const posts = [
        {
            title: 'The Story Your Walls Tell',
            slug: 'the-story-your-walls-tell',
            excerpt: 'Discover how art can transform your living space and reflect your personal journey.',
            content: 'Art is more than just decoration; it is a reflection of who we are. In this post, we explore how different pieces can change the mood of a room and tell a unique story about the people who live there. From bold abstract pieces to subtle landscapes, every choice matters.',
            imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop', // Wall art example
            author: 'Jane Doe',
        },
        {
            title: 'Holiday Gift Guide Pt.1',
            slug: 'holiday-gift-guide-pt-1',
            excerpt: 'Find the perfect gift for your loved ones with our curated selection of art and decor.',
            content: 'The holiday season is upon us, and finding the right gift can be stressful. We have curated a list of art pieces and home decor items that make for thoughtful and lasting gifts. whether you are looking for something small and meaningful or a statement piece.',
            imageUrl: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=2070&auto=format&fit=crop', // Holiday/Gift example
            author: 'John Smith',
        },
        {
            title: 'Party Like a Pro',
            slug: 'party-like-a-pro',
            excerpt: 'Tips and tricks for hosting an unforgettable gathering this season.',
            content: 'Hosting a party requires planning and creativity. Learn how to set the scene with the right lighting, music, and of course, art. We share our top tips for making your guests feel welcome and creating an atmosphere that they will remember for years to come.',
            imageUrl: 'https://images.unsplash.com/photo-1530103862676-de3c9a59aa38?q=80&w=2080&auto=format&fit=crop', // Party/Social example
            author: 'Alice Johnson',
        },
        {
            title: 'Art & Design Trends 2024',
            slug: 'art-and-design-trends-2024',
            excerpt: 'A look ahead at what is trending in the world of interior design and art.',
            content: 'As we move into a new year, we see a shift towards more sustainable materials and bold, expressive colors. Join us as we explore the upcoming trends that will define interior design in 2024 and how you can incorporate them into your home.',
            imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop', // Modern interior/Art
            author: 'Bob Brown',
        },
    ]

    for (const post of posts) {
        const existingPost = await prisma.post.findUnique({
            where: { slug: post.slug },
        })

        if (!existingPost) {
            await prisma.post.create({
                data: post,
            })
            console.log(`Created post: ${post.title}`)
        } else {
            console.log(`Post already exists: ${post.title}`)
        }
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
