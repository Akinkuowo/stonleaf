// app/artwork/[id]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Artwork Not Found</h1>
      <p className="text-gray-600 mb-8">The artwork you're looking for doesn't exist or has been removed.</p>
      <Link 
        href="/shop"
        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
      >
        Back to Shop
      </Link>
    </div>
  );
}