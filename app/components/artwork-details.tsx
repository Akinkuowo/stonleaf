// app/artwork/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiInstagram, FiFacebook, FiMail, FiChevronLeft, FiChevronRight, FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';
import { FaTiktok, FaPinterest, FaRegHeart, FaHeart } from 'react-icons/fa';
import Image from 'next/image';

import { useCart } from '@/context/CartContext';
import Toast from '@/components/Toast';

export default function ArtworkDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const artworkId = params.id as string;
  const { addItem } = useCart();

  const [artwork, setArtwork] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [selectedDimension, setSelectedDimension] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedArtworks, setRelatedArtworks] = useState<any[]>([]);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/artworks/${artworkId}`);

        if (!res.ok) {
          if (res.status === 404) {
            console.warn('Artwork not found, redirecting...');
            router.push('/shop');
          } else {
            throw new Error(`Failed to fetch artwork: ${res.status}`);
          }
          return;
        }

        const data = await res.json();

        // Map database fields to component fields for UI compatibility
        const mappedArtwork = {
          ...data,
          title: data.name,
          image: data.imageUrl || '/images/placeholder.jpg',
          images: data.imageUrl ? [data.imageUrl] : [], // Default to main image if others are missing
          dimensions: [
            { label: 'Standard', size: '12" x 16"' },
            { label: 'Large', size: '18" x 24"' },
            { label: 'Extra Large', size: '24" x 36"' }
          ],
          frameOptions: [
            { name: 'Classic Black', color: 'bg-black' },
            { name: 'Natural Wood', color: 'bg-amber-800' },
            { name: 'Modern White', color: 'bg-white border border-gray-300' }
          ],
          tags: [data.category],
          rating: 5.0,
          reviews: 0,
          inStock: data.stock > 0,
          stockCount: data.stock,
          details: data.description ? 'Premium quality print' : '',
        };

        setArtwork(mappedArtwork);

        // Fetch related artworks
        try {
          const relRes = await fetch('/api/artworks');
          if (relRes.ok) {
            const allArtworks = await relRes.json();
            const related = allArtworks
              .filter((a: any) => a.id !== artworkId)
              .slice(0, 4)
              .map((a: any) => ({
                id: a.id,
                title: a.name,
                artist: a.artist || 'Unknown Artist',
                price: a.price,
                image: a.imageUrl || '/images/placeholder.jpg',
              }));
            setRelatedArtworks(related);
          }
        } catch (relErr) {
          console.error('Error fetching related artworks:', relErr);
        }
      } catch (err) {
        console.error('Error fetching artwork details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (artworkId) {
      fetchArtwork();
    }
  }, [artworkId, router]);

  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    if (!artwork) return;

    addItem({
      id: artwork.id,
      title: artwork.title,
      price: artwork.price,
      quantity: quantity,
      image: artwork.image,
      artist: artwork.artist,
    });

    setShowToast(true);
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
              <div className="w-full h-full relative">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
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
            {relatedArtworks.map((related) => (
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