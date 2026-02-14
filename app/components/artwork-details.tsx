// app/artwork/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiInstagram, FiFacebook, FiMail, FiChevronLeft, FiChevronRight, FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';
import { FaTiktok, FaPinterest, FaRegHeart, FaHeart } from 'react-icons/fa';
import Image from 'next/image';

// Mock database of artworks
const ARTWORK_DATABASE = [
  { 
    id: 1, 
    title: 'Mona Lisa', 
    artist: 'Leonardo da Vinci', 
    year: '1503–1506',
    price: 450, 
    originalPrice: 520,
    discount: '15% OFF',
    description: 'The Mona Lisa is a half-length portrait painting by Italian artist Leonardo da Vinci. Considered an archetypal masterpiece of the Italian Renaissance, it has been described as "the best known, the most visited, the most written about, the most sung about, the most parodied work of art in the world."',
    details: 'Oil on poplar panel • 77 cm × 53 cm • Currently housed in the Louvre Museum, Paris',
    image: '/images/artwork_1.jpg',
    images: [
      '/images/artwork_1_detail_1.jpg',
      '/images/artwork_1_detail_2.jpg',
      '/images/artwork_1_detail_3.jpg'
    ],
    dimensions: [
      { label: 'Canvas Print', size: '12" x 16"' },
      { label: 'Framed Print', size: '18" x 24"' },
      { label: 'Premium Canvas', size: '24" x 36"' }
    ],
    frameOptions: [
      { name: 'Classic Black', color: 'bg-black' },
      { name: 'Natural Wood', color: 'bg-amber-800' },
      { name: 'Modern White', color: 'bg-white border border-gray-300' },
      { name: 'Gold Leaf', color: 'bg-yellow-600' }
    ],
    category: 'Canvas Art',
    tags: ['Renaissance', 'Portrait', 'Masterpiece', 'Italian Art'],
    rating: 4.9,
    reviews: 128,
    inStock: true,
    stockCount: 15,
    isNew: false,
    isFeatured: true
  },
  { 
    id: 2, 
    title: 'Starry Night', 
    artist: 'Vincent van Gogh', 
    year: '1889',
    price: 380, 
    originalPrice: 450,
    discount: '20% OFF',
    description: 'The Starry Night is an oil-on-canvas painting by the Dutch Post-Impressionist painter Vincent van Gogh. Painted in June 1889, it depicts the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an idealized village.',
    details: 'Oil on canvas • 73.7 cm × 92.1 cm • Currently in the Museum of Modern Art, New York',
    image: '/images/artwork_2.jpg',
    images: [
      '/images/artwork_2_detail_1.jpg',
      '/images/artwork_2_detail_2.jpg',
      '/images/artwork_2_detail_3.jpg'
    ],
    dimensions: [
      { label: 'Canvas Print', size: '12" x 16"' },
      { label: 'Framed Print', size: '18" x 24"' },
      { label: 'Premium Canvas', size: '24" x 36"' }
    ],
    frameOptions: [
      { name: 'Classic Black', color: 'bg-black' },
      { name: 'Natural Wood', color: 'bg-amber-800' },
      { name: 'Modern White', color: 'bg-white border border-gray-300' },
      { name: 'Silver Metal', color: 'bg-gray-400' }
    ],
    category: 'Canvas Art',
    tags: ['Post-Impressionism', 'Landscape', 'Night', 'Dutch Art'],
    rating: 4.8,
    reviews: 96,
    inStock: true,
    stockCount: 23,
    isNew: true,
    isFeatured: true
  },
  { 
    id: 3, 
    title: 'The Scream', 
    artist: 'Edvard Munch', 
    year: '1893',
    price: 520, 
    originalPrice: 600,
    discount: '13% OFF',
    description: 'The Scream is a composition created by Norwegian artist Edvard Munch in 1893. The agonized face in the painting has become one of the most iconic images of art, seen as symbolizing the anxiety of the human condition.',
    details: 'Oil, tempera, and pastel on cardboard • 91 cm × 73.5 cm • National Gallery, Oslo',
    image: '/images/artwork_3.jpg',
    images: [
      '/images/artwork_3_detail_1.jpg',
      '/images/artwork_3_detail_2.jpg',
      '/images/artwork_3_detail_3.jpg'
    ],
    dimensions: [
      { label: 'Canvas Print', size: '12" x 16"' },
      { label: 'Framed Print', size: '18" x 24"' },
      { label: 'Premium Canvas', size: '24" x 36"' }
    ],
    frameOptions: [
      { name: 'Classic Black', color: 'bg-black' },
      { name: 'Dark Walnut', color: 'bg-gray-800' },
      { name: 'Minimalist', color: 'bg-white border-2 border-gray-800' }
    ],
    category: 'Canvas Art',
    tags: ['Expressionism', 'Modern Art', 'Iconic', 'Norwegian Art'],
    rating: 4.7,
    reviews: 84,
    inStock: true,
    stockCount: 8,
    isNew: false,
    isFeatured: true
  },
  { 
    id: 4, 
    title: 'Girl with a Pearl Earring', 
    artist: 'Johannes Vermeer', 
    year: '1665',
    price: 420, 
    originalPrice: 480,
    discount: '12% OFF',
    description: 'Girl with a Pearl Earring is an oil painting by Dutch Golden Age painter Johannes Vermeer, dated c. 1665. Going by various names over the centuries, it became known by its present title towards the end of the 20th century after the earring worn by the girl portrayed there.',
    details: 'Oil on canvas • 44.5 cm × 39 cm • Mauritshuis, The Hague',
    image: '/images/artwork_4.jpg',
    images: [
      '/images/artwork_4_detail_1.jpg',
      '/images/artwork_4_detail_2.jpg',
      '/images/artwork_4_detail_3.jpg'
    ],
    dimensions: [
      { label: 'Canvas Print', size: '12" x 16"' },
      { label: 'Framed Print', size: '18" x 24"' },
      { label: 'Premium Canvas', size: '24" x 36"' }
    ],
    frameOptions: [
      { name: 'Classic Black', color: 'bg-black' },
      { name: 'Antique Gold', color: 'bg-yellow-700' },
      { name: 'Dark Wood', color: 'bg-gray-900' }
    ],
    category: 'Canvas Art',
    tags: ['Dutch Golden Age', 'Portrait', 'Baroque', 'Tronie'],
    rating: 4.9,
    reviews: 112,
    inStock: true,
    stockCount: 17,
    isNew: false,
    isFeatured: true
  },
  { 
    id: 5, 
    title: 'The Persistence of Memory', 
    artist: 'Salvador Dali', 
    year: '1931',
    price: 490, 
    originalPrice: 550,
    discount: '11% OFF',
    description: 'The Persistence of Memory is a 1931 painting by artist Salvador Dalí, and is one of his most recognizable works. The first soft watches appear in this piece, which has become an iconic symbol of Surrealism.',
    details: 'Oil on canvas • 24 cm × 33 cm • Museum of Modern Art, New York',
    image: '/images/artwork_5.jpg',
    images: [
      '/images/artwork_5_detail_1.jpg',
      '/images/artwork_5_detail_2.jpg',
      '/images/artwork_5_detail_3.jpg'
    ],
    dimensions: [
      { label: 'Canvas Print', size: '12" x 16"' },
      { label: 'Framed Print', size: '18" x 24"' },
      { label: 'Premium Canvas', size: '24" x 36"' }
    ],
    frameOptions: [
      { name: 'Classic Black', color: 'bg-black' },
      { name: 'Surreal Gold', color: 'bg-yellow-600' },
      { name: 'Modern Silver', color: 'bg-gray-300' }
    ],
    category: 'Canvas Art',
    tags: ['Surrealism', 'Modern Art', 'Iconic', 'Spanish Art'],
    rating: 4.8,
    reviews: 91,
    inStock: true,
    stockCount: 12,
    isNew: true,
    isFeatured: true
  },
  { 
    id: 6, 
    title: 'The Kiss', 
    artist: 'Gustav Klimt', 
    year: '1907–1908',
    price: 560, 
    originalPrice: 650,
    discount: '14% OFF',
    description: 'The Kiss is an oil-on-canvas painting with added gold leaf, silver and platinum by the Austrian Symbolist painter Gustav Klimt. It was painted at the height of his "Golden Period" when he painted a number of works in a similar gilded style.',
    details: 'Oil and gold leaf on canvas • 180 cm × 180 cm • Österreichische Galerie Belvedere, Vienna',
    image: '/images/artwork_6.jpg',
    images: [
      '/images/artwork_6_detail_1.jpg',
      '/images/artwork_6_detail_2.jpg',
      '/images/artwork_6_detail_3.jpg'
    ],
    dimensions: [
      { label: 'Canvas Print', size: '12" x 16"' },
      { label: 'Framed Print', size: '18" x 24"' },
      { label: 'Premium Canvas', size: '24" x 36"' }
    ],
    frameOptions: [
      { name: 'Classic Black', color: 'bg-black' },
      { name: 'Gold Leaf', color: 'bg-yellow-600' },
      { name: 'Art Deco', color: 'bg-gray-700' }
    ],
    category: 'Canvas Art',
    tags: ['Art Nouveau', 'Symbolism', 'Golden Period', 'Austrian Art'],
    rating: 4.9,
    reviews: 105,
    inStock: true,
    stockCount: 9,
    isNew: false,
    isFeatured: true
  }
];

// Related artworks for the recommendations section
const RELATED_ARTWORKS = [
  { id: 7, title: 'The Birth of Venus', artist: 'Sandro Botticelli', price: 480, image: '/images/related_1.jpg' },
  { id: 8, title: 'American Gothic', artist: 'Grant Wood', price: 390, image: '/images/related_2.jpg' },
  { id: 9, title: 'The Night Watch', artist: 'Rembrandt', price: 530, image: '/images/related_3.jpg' },
  { id: 10, title: 'Water Lilies', artist: 'Claude Monet', price: 410, image: '/images/related_4.jpg' }
];

export default function ArtworkDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const artworkId = parseInt(params.id as string);
  
  const [artwork, setArtwork] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [selectedDimension, setSelectedDimension] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundArtwork = ARTWORK_DATABASE.find(art => art.id === artworkId);
      if (foundArtwork) {
        setArtwork(foundArtwork);
      } else {
        // Redirect to shop if artwork not found
        router.push('/shop');
      }
      setIsLoading(false);
    }, 300);
  }, [artworkId, router]);
  
  const handleAddToCart = () => {
    alert(`Added ${quantity} ${artwork.title} to cart!`);
  };
  
 
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: `Check out ${artwork.title} by ${artwork.artist}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % (artwork?.images?.length || 1));
  };
  
  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + (artwork?.images?.length || 1)) % (artwork?.images?.length || 1));
  };
  
  const handleIncrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }
  
  if (!artwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Artwork Not Found</h1>
        <button 
          onClick={() => router.push('/shop')}
          className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          Back to Shop
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Back */}
      <div className="border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-black transition"
          >
            <FiChevronLeft className="mr-2" />
            Back to Shop
          </button>
        </div>
      </div>
      
      {/* Main Artwork Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {/* Main artwork image placeholder */}
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-sm">{artwork.title}</p>
                  <p className="text-xs text-gray-500">Click images to zoom</p>
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
              >
                <FiChevronLeft className="text-xl" />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
              >
                <FiChevronRight className="text-xl" />
              </button>
              
              {/* Badges */}
              {artwork.discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {artwork.discount}
                </div>
              )}
              {artwork.isNew && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  NEW
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              <div 
                className={`aspect-square bg-gray-200 rounded-md cursor-pointer border-2 ${selectedImage === 0 ? 'border-black' : 'border-transparent'}`}
                onClick={() => setSelectedImage(0)}
              >
                {/* Thumbnail 1 */}
              </div>
              {artwork.images?.map((_: any, index: number) => (
                <div 
                  key={index}
                  className={`aspect-square bg-gray-300 rounded-md cursor-pointer border-2 ${selectedImage === index + 1 ? 'border-black' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(index + 1)}
                >
                  {/* Additional thumbnails */}
                </div>
              ))}
            </div>
            
            {/* 360° View & AR Preview */}
            <div className="mt-8 flex gap-4">
              <button className="flex-1 py-3 border border-gray-300 rounded-md hover:border-black transition text-sm font-medium">
                👁️ 360° View
              </button>
              <button className="flex-1 py-3 border border-gray-300 rounded-md hover:border-black transition text-sm font-medium">
                📱 AR Preview
              </button>
            </div>
          </div>
          
          {/* Right Column - Details */}
          <div>
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-4">
              <span>Shop / </span>
              <span>{artwork.category} / </span>
              <span className="text-black">{artwork.title}</span>
            </div>
            
            {/* Title and Artist */}
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{artwork.title}</h1>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-lg text-gray-700 mb-1">by {artwork.artist} • {artwork.year}</p>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(Math.floor(artwork.rating))}
                    {'☆'.repeat(5 - Math.floor(artwork.rating))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    {artwork.rating} ({artwork.reviews} reviews)
                  </span>
                </div>
              </div>
              
              {/* Like and Share */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  {isLiked ? (
                    <FaHeart className="text-xl text-red-500" />
                  ) : (
                    <FaRegHeart className="text-xl text-gray-600" />
                  )}
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <FiShare2 className="text-xl text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">${artwork.price.toFixed(2)}</span>
                {artwork.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">${artwork.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <p className="text-green-600 text-sm mt-1">
                {artwork.inStock ? `In Stock (${artwork.stockCount} available)` : 'Out of Stock'}
              </p>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 mb-4">{artwork.description}</p>
              <p className="text-gray-600 text-sm">{artwork.details}</p>
            </div>
            
            {/* Dimensions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Select Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {artwork.dimensions.map((dim: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDimension(index)}
                    className={`py-3 border rounded-md transition ${selectedDimension === index ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'}`}
                  >
                    <div className="font-medium">{dim.label}</div>
                    <div className="text-sm">{dim.size}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Frame Options */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Frame Options</h3>
              <div className="flex gap-3">
                {artwork.frameOptions.map((frame: any, index: number) => (
                  <div key={index} className="text-center">
                    <button
                      onClick={() => setSelectedFrame(index)}
                      className={`w-16 h-16 rounded-md border-2 ${frame.color} ${selectedFrame === index ? 'border-black' : 'border-gray-300'}`}
                      title={frame.name}
                    />
                    <p className="text-xs mt-1">{frame.name}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={handleDecrementQuantity}
                    className="px-4 py-3 hover:bg-gray-100 transition"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-6 py-3 border-x border-gray-300">{quantity}</span>
                  <button 
                    onClick={handleIncrementQuantity}
                    className="px-4 py-3 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
                
                <div className="flex gap-3 flex-1">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3 border border-black text-black rounded-md hover:bg-black hover:text-white transition flex items-center justify-center gap-2 font-medium"
                  >
                    <FiShoppingCart />
                    Add to Cart
                  </button>
                 
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-8">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Category</p>
                  <p className="font-medium">{artwork.category}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Delivery</p>
                  <p className="font-medium">3-5 Business Days</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Returns</p>
                  <p className="font-medium">30-Day Return Policy</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Certificate</p>
                  <p className="font-medium">Certificate of Authenticity Included</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Artworks */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {RELATED_ARTWORKS.map((related) => (
              <div 
                key={related.id}
                className="group cursor-pointer"
                onClick={() => router.push(`/artwork/${related.id}`)}
              >
                <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
                  <div className="w-full h-full group-hover:scale-105 transition-transform duration-500">
                    {/* Related artwork image */}
                  </div>
                </div>
                <h3 className="font-medium group-hover:text-gray-700 transition">
                  {related.title}
                </h3>
                <p className="text-gray-600 text-sm">{related.artist}</p>
                <p className="font-semibold mt-1">${related.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Reviews Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl font-bold">{artwork.rating}</div>
              <div>
                <div className="flex text-yellow-400 text-2xl">
                  {'★'.repeat(Math.floor(artwork.rating))}
                  {'☆'.repeat(5 - Math.floor(artwork.rating))}
                </div>
                <p className="text-gray-600">{artwork.reviews} reviews</p>
              </div>
            </div>
            
            {/* Sample Reviews */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Sarah M.</span>
                  <span className="text-gray-500 text-sm">2 weeks ago</span>
                </div>
                <div className="flex text-yellow-400 mb-2">
                  ★★★★★
                </div>
                <p className="text-gray-600">
                  "Absolutely stunning! The colors are vibrant and the print quality is exceptional. 
                  It looks even better in person than on the website."
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Michael T.</span>
                  <span className="text-gray-500 text-sm">1 month ago</span>
                </div>
                <div className="flex text-yellow-400 mb-2">
                  ★★★★☆
                </div>
                <p className="text-gray-600">
                  "Beautiful artwork, excellent framing. Delivery was fast and packaging was secure. 
                  Would recommend to any art lover!"
                </p>
              </div>
            </div>
            
            <button className="mt-8 text-black border-b-2 border-black pb-1 font-medium hover:opacity-80 transition">
              View All Reviews →
            </button>
          </div>
        </div>
      </section>
      
    </div>
  );
}