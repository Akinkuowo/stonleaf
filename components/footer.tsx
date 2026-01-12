'use client'

import { ArrowRight, Instagram, Facebook } from 'lucide-react';
// We'll use a custom icon for Pinterest as it might not be in the standard set or just use a generic one if needed.
// Lucide has 'Pin' but it's not the logo. We can use a simple generic one or just text for now to match exactly.
// Actually, let's stick to standard Lucide icons for now or SVGs if we want exact matches.
// For the flag emojis, we'll use standard unicode.

export default function Footer() {
  const flags = [
    { country: 'UK', emoji: '🇬🇧' },
    { country: 'EU', emoji: '🇪🇺' },
    { country: 'USA', emoji: '🇺🇸' },
    { country: 'Canada', emoji: '🇨🇦' },
    { country: 'Australia', emoji: '🇦🇺' },
    { country: 'South Korea', emoji: '🇰🇷' },
    { country: 'Mexico', emoji: '🇲🇽' },
    { country: 'Sweden', emoji: '🇸🇪' },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white pt-20 pb-10 px-8 md:px-14 min-h-[400px]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-16 lg:gap-8 mb-24">

          {/* Left Section - Email Signup */}
          <div className="w-full lg:w-1/3 max-w-md">
            <div className="mb-2 text-sm text-gray-300">E-mail</div>
            <div className="relative border-b border-gray-600 pb-2 mb-4">
              <input
                type="email"
                className="w-full bg-transparent outline-none text-white placeholder-transparent"
                aria-label="Email address"
                placeholder="E-mail"
              />
            </div>
            <div className='flex justify-between'>
              <p className="text-sm font-light text-white">
                Sign up for our newsletter and <span className="font-bold">get 20% off</span>
              </p>

              <button className=" text-white">
                <ArrowRight size={20} className="opacity-80" />
              </button>
            </div>
          </div>

          {/* Right Section - Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-10 lg:gap-x-24 text-sm">

            {/* Column 1 */}
            <div className="flex flex-col space-y-2">
              <h3 className="font-bold mb-2">About STONLEAF</h3>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About the Founders</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">How to Hang</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Trade Program</a>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col space-y-2">
              <h3 className="font-bold mb-2">FAQ</h3>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Sizing & Framing</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col space-y-2">
              <h3 className="font-bold mb-2">Connect</h3>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">TikTok</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Pinterest</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-16 lg:gap-8">

          {/* Logo */}
          <div className='w-full lg:w-1/3 max-w-md flex flex-col lg:flex-row justify-between'>
            <h1 className="text-2xl font-bold tracking-wider">STONLEAF</h1>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0"></path><path d="M12 12v6"></path><path d="M12 2v2"></path><circle cx="12" cy="12" r="10"></circle></svg>
              </a>
            </div>
          </div>

          {/*Local Printing */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-8 md:gap-12">
            {/* Local Printing Flags */}
            <div className="flex flex-col items-start gap-2">
              <span className="text-xs tracking-[0.2em] font-bold text-gray-300 uppercase text-left">LOCAL PRINTING IN:</span>
              <div className="flex gap-3">
                {flags.map((flag) => (
                  <span
                    key={flag.country}
                    title={flag.country}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 border border-gray-600 overflow-hidden cursor-default hover:scale-110 transition-transform"
                  >
                    <span className="text-xl leading-none">{flag.emoji}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer >
  )
}