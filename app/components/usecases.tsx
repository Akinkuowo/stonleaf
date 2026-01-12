'use client'

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Usecases() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const usecases = [
    {
      id: 1,
      image: "/images/use_case.webp",
      title: "Home Decor"
    },
    {
      id: 2,
      image: "/images/use_case_2.jpg",
      title: "Office Space"
    },
    {
      id: 3,
      image: "/images/use_case_3.jpeg",
      title: "Gallery Wall"
    },
    {
      id: 4,
      image: "/images/use_case_4.webp",
      title: "Gallery Wall"
    },
    {
      id: 5,
      image: "/images/use_case_5.webp",
      title: "Modern Living"
    },
    {
      id: 6,
      image: "/images/use_case_6.jpg",
      title: "Art Studio"
    }
  ];

  const scrollToIndex = (index: number) => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const cardWidth = 350; // Fixed card width
      const gap = 16; // 1rem gap

      // Calculate scroll position: move by half a card width to show the peek effect
      const scrollAmount = (cardWidth + gap) * index + (cardWidth / 2);

      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    const maxIndex = usecases.length - 3; // Can show 2 full + 2 halves = need at least 3 cards
    const newIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  const prevSlide = () => {
    const maxIndex = usecases.length - 3;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : maxIndex;
    scrollToIndex(newIndex);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0].pageX - (sliderRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // Initialize scroll position on mount
  useEffect(() => {
    if (sliderRef.current) {
      const cardWidth = 350;
      sliderRef.current.scrollLeft = cardWidth / 2;
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section id="usecases" className="px-14 py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide mb-2">
            <span className="text-gray-800">USE CASES</span>
          </h2>
        </div>

        {/* Slider Container - Desktop */}
        <div className="hidden md:block relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 -ml-6"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 -mr-6"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Slider - shows 3 card widths (0.5 + 1 + 1 + 0.5) */}
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex gap-4 overflow-x-hidden scroll-smooth cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              {usecases.map((usecase) => (
                <div
                  key={usecase.id}
                  className="slider-card flex-shrink-0 w-[350px] group"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-100">
                    {/* Image */}
                    <img
                      src={usecase.image}
                      alt={usecase.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      draggable="false"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                    {/* Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-white text-xl font-semibold">
                        {usecase.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: usecases.length - 2 }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index
                  ? 'w-8 bg-gray-800'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Slider - Single card view */}
        <div className="md:hidden relative max-w-lg mx-auto">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg -ml-4"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg -mr-4"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {usecases.map((usecase) => (
                <div
                  key={usecase.id}
                  className="flex-shrink-0 w-full"
                >
                  <div className="relative overflow-hidden rounded-lg aspect-[3/4] bg-gray-100">
                    <img
                      src={usecase.image}
                      alt={usecase.title}
                      className="w-full h-full object-cover"
                      draggable="false"
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-white text-xl font-semibold">
                        {usecase.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots for mobile */}
          <div className="flex justify-center gap-2 mt-6">
            {usecases.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index
                  ? 'w-8 bg-gray-800'
                  : 'w-2 bg-gray-300'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-gray-800 text-gray-800 font-medium rounded-full hover:bg-gray-800 hover:text-white transition-all duration-300">
            View All Use Cases
          </button>
        </div>
      </div>
    </section>
  );
}