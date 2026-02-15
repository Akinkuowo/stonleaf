
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'

async function getPost(slug: string) {
    return await prisma.post.findUnique({
        where: { slug },
    })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getPost(slug)

    if (!post) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-500 mb-8">{post.createdAt.toLocaleDateString()}</p>

            {post.imageUrl && (
                <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <div className="prose lg:prose-xl">
                <p className="text-lg leading-relaxed">{post.content}</p>
            </div>
        </div>
    )
}
