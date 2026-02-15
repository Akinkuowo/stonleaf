
// import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

// Mock data for testing
const MOCK_POSTS = [
    {
        id: '1',
        title: 'Test Post 1',
        slug: 'test-post-1',
        imageUrl: null,
        createdAt: '2024-01-01',
    },
    {
        id: '2',
        title: 'Test Post 2',
        slug: 'test-post-2',
        imageUrl: null,
        createdAt: '2024-01-02',
    }
]

async function getPosts() {
    // const posts = await prisma.post.findMany({
    //     orderBy: { createdAt: 'desc' },
    // })
    // return posts
    return MOCK_POSTS
}

export default async function BlogPage() {
    const posts = await getPosts()

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-light mb-12 text-center tracking-tight">Our Stories</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {posts.map((post) => (
                    <article key={post.id} className="flex flex-col group">
                        <Link href={`/blog/${post.slug}`} className="block overflow-hidden mb-4">
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                {post.imageUrl ? (
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </Link>

                        <div className="flex flex-col">
                            <h2 className="text-xl font-medium mb-2 text-gray-900 group-hover:text-gray-600 transition-colors">
                                <Link href={`/blog/${post.slug}`}>
                                    {post.title}
                                </Link>
                            </h2>

                            <Link
                                href={`/blog/${post.slug}`}
                                className="text-sm text-gray-500 underline decoration-gray-300 hover:decoration-gray-900 underline-offset-4 transition-all w-fit"
                            >
                                Read more
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    No blog posts found.
                </div>
            )}
        </div>
    )
}
