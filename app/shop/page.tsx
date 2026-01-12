
import { prisma } from '@/lib/prisma'
import Image from 'next/image'

export const revalidate = 0 // Ensure dynamic data fetching

export default async function ShopPage() {
    let products = []
    try {
        products = await prisma.product.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
    } catch (error) {
        console.error("Failed to fetch products:", error)
        // Handle error gracefully or allow empty state
    }

    return (
        <div className="min-h-screen bg-white pt-24 pb-20 px-8 md:px-14">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-12">
                    <h1 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        {products.length} Products
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {products.map((product) => (
                        <div key={product.id} className="group cursor-pointer">
                            {/* Image Container with Hover Effect */}
                            <div className="relative aspect-[4/3] bg-gray-100 mb-6 overflow-hidden">
                                {product.imageUrl && (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                )}
                                {/* Optional border on hover if needed, similar to gallery */}
                                <div className="absolute inset-0 border border-transparent group-hover:border-black/5 transition-colors duration-300"></div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-gray-900 tracking-wide uppercase">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 font-light tracking-wide">
                                    from ${product.price}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Fallback for no products (or DB error) */}
                    {products.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-500">
                            <p>No products found or database connection failed.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
