
"use client";

import { useState } from 'react';
import { FiInstagram, FiFacebook, FiMail } from 'react-icons/fi';
import { FaTiktok, FaPinterest, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';

const CollaboratorsPage = () => {
  const [email, setEmail] = useState('');

  // Artist data
  const artists = [
    { 
      id: 1, 
      name: 'Kate Fella', 
      bio: 'Contemporary artist specializing in abstract expressionism',
      image: '/images/artists/kate-fella.jpg',
      worksCount: 42,
      category: 'Abstract'
    },
    { 
      id: 2, 
      name: 'Jessica Stone', 
      bio: 'Modern sculptor with a focus on geometric forms',
      image: '/images/artists/jessica-stone.jpg',
      worksCount: 28,
      category: 'Sculpture'
    },
    { 
      id: 3, 
      name: 'A FOLABI TOBI', 
      bio: 'Nigerian artist blending traditional African motifs with contemporary themes',
      image: '/images/artists/afolabi-tobi.jpg',
      worksCount: 56,
      category: 'Mixed Media'
    },
    { 
      id: 4, 
      name: 'Chukuma Kan', 
      bio: 'Digital artist exploring the intersection of technology and nature',
      image: '/images/artists/chukuma-kan.jpg',
      worksCount: 37,
      category: 'Digital Art'
    },
    { 
      id: 5, 
      name: 'Tiwa Lawa', 
      bio: 'Photographer capturing urban landscapes and human stories',
      image: '/images/artists/tiwa-lawa.jpg',
      worksCount: 64,
      category: 'Photography'
    },
    { 
      id: 6, 
      name: 'John Yun', 
      bio: 'Korean-American painter specializing in minimalist compositions',
      image: '/images/artists/john-yun.jpg',
      worksCount: 31,
      category: 'Minimalism'
    },
  ];

  const influencers = [
     {
      id: 1, 
      name: 'Kate Fella', 
      bio: 'Contemporary artist specializing in abstract expressionism',
      image: '/images/artists/kate-fella.jpg',
      worksCount: 42,
      category: 'Abstract'
    },
    { 
      id: 2, 
      name: 'Jessica Stone', 
      bio: 'Modern sculptor with a focus on geometric forms',
      image: '/images/artists/jessica-stone.jpg',
      worksCount: 28,
      category: 'Sculpture'
    },
    { 
      id: 3, 
      name: 'A FOLABI TOBI', 
      bio: 'Nigerian artist blending traditional African motifs with contemporary themes',
      image: '/images/artists/afolabi-tobi.jpg',
      worksCount: 56,
      category: 'Mixed Media'
    }
  ]


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              COLLABORATORS
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collaborators
            </p>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-12 px-19 sm:px-6 lg:px-19 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist, index) => (
              <div 
                key={artist.id}
                className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                {/* Artist Image */}
                <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center mx-auto mb-4">
                        <span className="text-gray-600 text-2xl font-bold">
                          {artist.name.charAt(0)}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm">Artist Portrait</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Artist Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {artist.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {artist.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {artist.worksCount} works
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* <p className="text-gray-600 mb-4 line-clamp-2">
                    {artist.bio}
                  </p> */}

                  
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-900 rounded-lg transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default CollaboratorsPage;