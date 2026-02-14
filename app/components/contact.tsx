'use client'

import { useState, useRef, useEffect } from 'react';
import { Award, Frame, Truck, X } from 'lucide-react';

export default function LetsTalk() {
  const [showPopup, setShowPopup] = useState(false);
  const [showCountriesPopup, setShowCountriesPopup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const popupRef = useRef<HTMLDivElement>(null);
  const countriesPopupRef = useRef<HTMLDivElement>(null);

  //   const countries = [
  //     { name: 'Australia', code: 'au' },
  //     { name: 'South Korea', code: 'kr' },
  //     { name: 'Mexico', code: 'mx' },
  //     { name: 'Sweden', code: 'se' },
  //     { name: 'United Kingdom', code: 'gb' },
  //     { name: 'European Union', code: 'eu' },
  //     { name: 'United States', code: 'us' },
  //     { name: 'Canada', code: 'ca' },
  //   ];

  const countries = [
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'South Korea', flag: '🇰🇷' },
    { name: 'Mexico', flag: '🇲🇽' },
    { name: 'Sweden', flag: '🇸🇪' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'European Union', flag: '🇪🇺' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'Canada', flag: '🇨🇦' },
  ];

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
      if (countriesPopupRef.current && !countriesPopupRef.current.contains(event.target as Node)) {
        setShowCountriesPopup(false);
      }
    };

    if (showPopup || showCountriesPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup, showCountriesPopup]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Validate all fields are filled
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);

    // Reset form and close popup
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
    setShowPopup(false);

    // Show success message
    alert('Thank you! We will be in touch soon.');
  };

  const handleCheckCountries = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowCountriesPopup(true);
  };

  return (
    <>
      <section className="relative bg-white min-h-[600px] px-14">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/CONTACT%20US%20copy.png')" }}
        >
          {/* Optional overlay for better contrast */}
          <div className="absolute inset-0 bg-black/5"></div>
        </div>

        {/* Content Grid */}
        <div className="relative grid md:grid-cols-2 min-h-[600px]">
          {/* Left Side - Empty (shows background) */}
          <div className="hidden md:block"></div>

          {/* Right Side - Content with White Background */}
          <div className="flex flex-col justify-center px-8 md:px-16 py-12 md:py-16 bg-white">
            {/* Features */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              {/* Best Quality */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src='/images/Icons/icon (6).png'  alt="User" />
                  </div>
                </div>
                <h3 className="text-xs font-semibold tracking-wider mb-2 text-gray-800">
                  BEST QUALITY
                </h3>
                <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-wide">
                  Quality print<br />and finish.
                </p>
              </div>

              {/* Frame Included */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src='/images/Icons/icon (5).png'  alt="User" />
                  </div>
                </div>
                <h3 className="text-xs font-semibold tracking-wider mb-2 text-gray-800">
                  FRAME INCLUDED
                </h3>
                <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-wide">
                  Sealed and delivered<br />with ready to hang<br />frame
                </p>
              </div>

              {/* Free Shipping */}
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img src='/images/Icons/icon (4).png' alt="User" />
                  </div>
                </div>
                <h3 className="text-xs font-semibold tracking-wider mb-2 text-gray-800">
                  FREE SHIPPING
                </h3>
                <p className="text-[10px] text-gray-600 leading-relaxed uppercase tracking-wide">
                  10-14 days within<br />listed countries
                </p>
                <button
                  onClick={handleCheckCountries}
                  className="text-[9px] text-amber-600 hover:text-amber-700 font-medium uppercase tracking-wider mt-1 inline-block cursor-pointer"
                >
                  Check countries
                </button>
              </div>
            </div>

            {/* Main CTA */}
            <div className="max-w-xl">
              <h2 className="text-md md:text-md font-light tracking-[0.2em] text-gray-800 mb-8 leading-relaxed">
                CURATE YOU NEXT COLLECTION WITH US.
              </h2>

              <div className='w-60 mx-auto text-center'>
                <button
                  onClick={() => setShowPopup(true)}
                  className="cursor-pointer bg-gray-900 text-white px-2 py-1 text-sm font-medium tracking-[0.15em] hover:bg-gray-800 transition-colors duration-300 rounded-md "
                >
                  LET'S TALK
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Popup Modal */}
      {showCountriesPopup && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div
            ref={countriesPopupRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div></div>
                <button
                  onClick={() => setShowCountriesPopup(false)}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-xl font-light tracking-[0.15em] text-gray-900 mb-2">
                  LIST OF COUNTRIES ELIGIBLE
                </h2>
                <p className="text-sm font-light tracking-[0.15em] text-gray-900">
                  FOR FREE SHIPPING
                </p>
              </div>

              {/* Country Flags Grid */}
              <div className="grid grid-cols-4 gap-6 justify-items-center">
                {countries.map((country, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white">
                      <span className="text-4xl leading-none">{country.flag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div
            ref={popupRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div></div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-light tracking-[0.15em] text-gray-900 mb-2">
                  LET'S TALK
                </h2>
                <p className="text-sm text-gray-600">
                  Just few details, and we'll be in touch soon.<br />
                  We are excited to connect with you!
                </p>
              </div>

              {/* Form Fields */}
              <div>
                {/* Name Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>

                {/* Message Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project or inquiry"
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="cursor-pointer w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium tracking-wider"
                >
                  SEND
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}