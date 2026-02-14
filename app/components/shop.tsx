// app/shop/page.jsx
"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

const ShopPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';
  
  const [email, setEmail] = useState('');
  const [hoveredArtwork, setHoveredArtwork] = useState<number | null>(null);
  
  // Updated categories to match header navigation
  const categories = [
    { name: 'ALL', id: 'all', label: 'All' },
    { name: 'CANVAS ART', id: 'canvas', label: 'Canvas Art' },
    { name: 'PHOTO ART', id: 'photo', label: 'Photo Art' },
    { name: 'DIGITAL ART', id: 'digital', label: 'Digital Art' },
    { name: 'AR ART', id: 'ar', label: 'AR Art' },
    // Removed 'SCULPTURES' and 'ARTIFACTS' to match header
  ];
  
  // Mock artwork data with categories
  const artworks = [
    { id: 1, title: 'Mona Lisa', artist: 'Leonardo da Vinci', price: 450, image: '/images/arkwork_3.jpg', category: 'canvas' },
    { id: 2, title: 'Starry Night', artist: 'Vincent van Gogh', price: 380, image: '/images/artwork_8.jpeg', category: 'canvas' },
    { id: 3, title: 'The Scream', artist: 'Edvard Munch', price: 520, image: '/images/artwork_4.jpg', category: 'photo' },
    { id: 4, title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', price: 420, image: '/images/artwork_6.jpg', category: 'photo' },
    { id: 5, title: 'The Persistence of Memory', artist: 'Salvador Dali', price: 490, image: '/images/artwork_2.webp', category: 'digital' },
    { id: 6, title: 'The Kiss', artist: 'Gustav Klimt', price: 560, image: '/images/artwork_7.jpg', category: 'digital' },
    { id: 7, title: 'Augmented Dreams', artist: 'AI Artist Collective', price: 320, image: '/images/artwork.webp', category: 'ar' },
    { id: 8, title: 'Virtual Reality', artist: 'Tech Art Studio', price: 280, image: '/images/arkwork_5.webp', category: 'ar' },
  ];
  
  // Filter artworks based on current category
  const filteredArtworks = currentCategory === 'all' 
    ? artworks 
    : artworks.filter(artwork => artwork.category === currentCategory);
  
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      router.push('/shop');
    } else {
      router.push(`/shop?category=${categoryId}`);
    }
  };
  
  const handleArtworkClick = (artworkId: number) => {
    router.push(`/artwork/${artworkId}`);
  };
  
  const handleArtworkHover = (artworkId: number) => {
    setHoveredArtwork(artworkId);
  };
  
  const handleArtworkLeave = () => {
    setHoveredArtwork(null);
  };
  
  return (
    <div className="min-h-screen">
      {/* Category Navigation - Updated to match header */}
      <section className="w-full bg-white">
        <div className="max-w-[70rem] bg-gray-100 mx-auto px-4 sm:px-6 mt-20">
          <div className="flex flex-wrap justify-between py-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  cursor-pointer text-xs md:text-sm font-medium px-2 py-1 transition rounded whitespace-nowrap
                  ${currentCategory === category.id 
                    ? 'text-black font-bold' 
                    : 'text-gray-700 hover:text-black hover:text-underline'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-19">
          {/* Category Title */}
          <div className="mb-8 text-left">
            
            <p className="text-gray-600 mt-2">
              {filteredArtworks.length} {filteredArtworks.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork) => (
              <div 
                key={artwork.id}
                className="group cursor-pointer relative"
                onClick={() => handleArtworkClick(artwork.id)}
                onMouseEnter={() => handleArtworkHover(artwork.id)}
                onMouseLeave={handleArtworkLeave}
              >
                <div className="aspect-square bg-gray-200 mb-4 overflow-hidden rounded-lg relative">
                  {/* Artwork Image Placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full flex items-center justify-center text-gray-400 relative">
                      {/* For production, use Next.js Image component: */}
                      <Image 
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {/* <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Artwork Preview</span>
                      </div> */}
                    </div>
                    
                    {/* Hover Overlay with Artwork Name */}
                    <div className={`
                      absolute inset-0 bg-black/70 flex items-center justify-center transition-all duration-300
                      ${hoveredArtwork === artwork.id ? 'opacity-100' : 'opacity-0'}
                    `}>
                      <div className="text-center p-4">
                        <h3 className="text-xl font-bold text-white mb-2">{artwork.title}</h3>
                        <p className="text-white/80">Click to view details</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Artwork Info (Always Visible) */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium group-hover:text-gray-700 transition-colors">
                      {artwork.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{artwork.artist}</p>
                    <div className="mt-1">
                    
                    </div>
                  </div>
                  <p className="font-semibold">${artwork.price.toFixed(2)}</p>
                </div>
                
                {/* Hover Indicator */}
                {hoveredArtwork === artwork.id && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-black transition-all duration-300"></div>
                )}
              </div>
            ))}
          </div>
          
          {filteredArtworks.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No artworks found in this category</h3>
              <p className="text-gray-600 mb-4">Try selecting a different category</p>
              <button
                onClick={() => router.push('/shop')}
                className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
              >
                View All Artworks
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ShopPage;