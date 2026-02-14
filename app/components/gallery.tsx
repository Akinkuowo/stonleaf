'use client'

import { useState } from 'react'

export default function Gallery() {
  const galleryItems = [
    { id: 1, image: "/images/artwork.webp", title: "Art Piece 1" },
    { id: 2, image: "/images/artwork_2.webp", title: "Art Piece 2" },
    { id: 3, image: "/images/arkwork_3.jpg", title: "Art Piece 3" },
    { id: 4, image: "/images/artwork_4.jpg", title: "Art Piece 4" },
    { id: 5, image: "/images/arkwork_5.webp", title: "Art Piece 5" },
    { id: 6, image: "/images/artwork_6.jpg", title: "Art Piece 6" },
    { id: 7, image: "/images/artwork_7.jpg", title: "Art Piece 7" },
    { id: 8, image: "/images/artwork_8.jpeg", title: "Art Piece 8" },
  ]

  return (
    <section id="gallery" className="px-14 py-19 md:py-24 bg-gray-50">
      <div className="container mx-auto ">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light tracking-[0.3em] text-gray-800 mb-2">
            GALLERY
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 max-w-7xl mx-auto">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden bg-white aspect-square cursor-pointer"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Black Border on Hover */}
              <div className="absolute inset-0 border-[2px] border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              {/* Optional: Subtle overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300"></div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-16">
          <a href='' className="px-12 py-3 text-sm font-light tracking-[0.2em] text-gray-800 hover:text-black hover:underline transition-colors duration-300">
            VIEW MORE
          </a>
        </div>
      </div>
    </section>
  )
}