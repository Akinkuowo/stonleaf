'use client'

import { useState, useRef, useEffect, Suspense } from 'react';
import { Search, X, Mail, Lock, Eye, EyeOff, Loader2, User, LogOut, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import BecomeMarketerModal from '@/components/BecomeMarketerModal';
import { useCart } from '@/context/CartContext';

type MenuId = 'shop' | 'partners' | 'sellers' | 'about' | null;
type AuthMode = 'signin' | 'signup' | 'forgot-password' | null;
type CategoryType = 'all' | 'canvas' | 'photo' | 'digital' | 'ar';

interface MenuItem {
  label: string;
  category: CategoryType | null;
  href?: string;
  onClick?: () => void;
}

interface MenuData {
  id: MenuId;
  label: string;
  items: MenuItem[];
  link?: string;
}

interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any;
  token?: string;
}

export default function Header() {
  return (
    <Suspense fallback={<div className="h-20 bg-white" />}>
      <HeaderContent />
    </Suspense>
  )
}

function HeaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { itemCount, syncCart } = useCart();
  const [activeMenu, setActiveMenu] = useState<MenuId>('shop');
  const [hoveredMenu, setHoveredMenu] = useState<MenuId>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState<AuthMode>(null);
  const [isMarketerModalOpen, setIsMarketerModalOpen] = useState(false);
  const [showAboutPopup, setShowAboutPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    country: ''
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const authPopupRef = useRef<HTMLDivElement>(null);
  const aboutPopupRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock dropdown data for each menu item
  const menuItems: MenuData[] = [
    {
      id: 'shop' as const,
      label: 'SHOP',
      items: [
        { label: 'All', category: 'all' },
        { label: 'Canvas Art', category: 'canvas' },
        { label: 'Photo Art', category: 'photo' },
        { label: 'Digital Art', category: 'digital' },
        { label: 'AR Art', category: 'ar' }
      ],
      link: '/shop'
    },
    {
      id: 'partners' as const,
      label: 'OUR PARTNERS',
      items: [
        { label: 'Collaborators', category: null, href: '/collaborators' }
      ]
    },
    {
      id: 'sellers' as const,
      label: 'JOIN OUR SELLERS',
      items: [
        {
          label: 'I am a Marketer',
          category: null,
          onClick: () => {
            setIsMarketerModalOpen(true);
            setHoveredMenu(null);
          }
        }
      ]
    },
    {
      id: 'about' as const,
      label: 'ABOUT',
      items: [
        {
          label: 'About Us',
          category: null,
          onClick: () => {
            setShowAboutPopup(true);
            setHoveredMenu(null);
          }
        },
        { label: 'Blog', category: null, href: '/blog' },
        { label: 'DIY Hang', category: null, href: '/diy-hang' }
      ]
    }
  ];

  // Authentication functions
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log('User signed in:', data.user);
        loadUser();
        await syncCart();
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error || 'Sign in failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const signUp = async (userData: {
    email: string
    password: string
    name: string
    country: string
  }): Promise<AuthResponse> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log('User signed up:', data.user);
        loadUser();
        await syncCart();
        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error || 'Sign up failed' };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  // Load user from token
  const loadUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        console.error('Failed to decode token', e);
        localStorage.removeItem('token');
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, [showAuthPopup]); // Reload when auth popup closes (potentially after login)

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserDropdownOpen(false);
    window.location.href = '/';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (authPopupRef.current && !authPopupRef.current.contains(event.target as Node)) {
        setShowAuthPopup(null);
      }
      if (aboutPopupRef.current && !aboutPopupRef.current.contains(event.target as Node)) {
        setShowAboutPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (leaveTimeoutRef.current) {
        clearTimeout(leaveTimeoutRef.current);
      }
    };
  }, []);

  // Focus search input when shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Handle auth popup based on search params
  useEffect(() => {
    const authAction = searchParams.get('auth');
    if (authAction === 'signin') {
      setShowAuthPopup('signin');
    } else if (authAction === 'signup') {
      setShowAuthPopup('signup');
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (authError) setAuthError(null);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthLoading(true);

    try {
      if (showAuthPopup === 'signin') {
        const result = await signIn(formData.email, formData.password);
        if (result.success) {
          setShowAuthPopup(null);
          setFormData({ email: '', password: '', confirmPassword: '', name: '', country: '' });

          // Redirect based on role
          if (result.user?.role === 'ARTIST') {
            window.location.href = '/dashboard/artist';
          } else if (result.user?.role === 'MARKETER') {
            window.location.href = '/dashboard/marketer';
          } else if (result.user?.role === 'ADMIN') {
            window.location.href = '/admin/dashboard';
          } else {
            window.location.href = '/dashboard/customer';
          }
        } else {
          setAuthError(result.error || 'Sign in failed');
        }
      } else if (showAuthPopup === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setAuthError('Passwords do not match');
          return;
        }

        const result = await signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          country: formData.country
        });

        if (result.success) {
          setShowAuthPopup(null);
          setFormData({ email: '', password: '', confirmPassword: '', name: '', country: '' });
          loadUser();
          await syncCart();
          window.location.href = '/dashboard/customer';
        } else {
          setAuthError(result.error || 'Sign up failed');
        }
      } else if (showAuthPopup === 'forgot-password') {
        try {
          const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email })
          });
          const data = await response.json();
          if (response.ok) {
            setAuthMessage(data.message);
            setFormData(prev => ({ ...prev, email: '' }));
            if (data.debugResetUrl) {
              console.log('DEBUG: Reset Link:', data.debugResetUrl);
            }
          } else {
            setAuthError(data.error || 'Request failed');
          }
        } catch (error) {
          setAuthError('Network error. Please try again.');
        }
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const switchAuthMode = () => {
    setShowAuthPopup(showAuthPopup === 'signin' ? 'signup' : 'signin');
    setAuthError(null);
    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
  };

  const openAuthPopup = (mode: 'signin' | 'signup' | 'forgot-password') => {
    setShowAuthPopup(mode);
    setUserDropdownOpen(false);
    setAuthError(null);
    setAuthMessage(null);
  };

  const handleMenuEnter = (menuId: MenuId) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setHoveredMenu(menuId);
  };

  const handleMenuLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
      leaveTimeoutRef.current = null;
    }, 2000);
  };

  const handleUserDropdownEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setUserDropdownOpen(true);
  };

  const handleUserDropdownLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
      leaveTimeoutRef.current = null;
    }, 2000);
  };

  const cancelLeaveTimeout = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  // Handle shop menu click
  const handleShopClick = () => {
    router.push('/shop');
    setActiveMenu('shop');
  };

  // Handle category click
  const handleCategoryClick = (category: CategoryType) => {
    if (category === 'all') {
      router.push('/shop');
    } else {
      router.push(`/shop?category=${category}`);
    }
    setActiveMenu('shop');
    setHoveredMenu(null);
  };

  // Handle partners menu click
  const handlePartnersClick = () => {
    setActiveMenu('partners');
  };

  // Handle navigation to specific pages
  const handleNavigation = (href?: string) => {
    if (href) {
      router.push(href);
      setHoveredMenu(null);
      setActiveMenu('partners');
    }
  };

  return (
    <div className="bg-white h-[12rem]">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-4 text-sm">
        VISIT OUR STORE <Link href="/shop" className="text-white underline">HERE</Link>
      </div>

      {/* Header */}
      <header className="bg-white px-14 py-4 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight cursor-pointer">STONLEAF</h1>
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              {/* User Icon with Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  className="cursor-pointer text-gray-900 hover:text-gray-600 relative"
                  onMouseEnter={handleUserDropdownEnter}
                >
                  <img src='/images/Icons/icon (3).png' className='w-7 h-7' alt="User" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div
                    className="absolute top-full right-[-10px] mt-2 w-72 bg-white shadow-2xl rounded-2xl p-6 z-50 border border-gray-100 flex flex-col gap-6"
                    onMouseEnter={cancelLeaveTimeout}
                    onMouseLeave={handleUserDropdownLeave}
                  >
                    {!user ? (
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => openAuthPopup('signin')}
                          className="cursor-pointer block w-full text-center py-3 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-all duration-200"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => openAuthPopup('signup')}
                          className="cursor-pointer block w-full text-center py-3 text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                        >
                          Sign Up
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
                            {/* Fallback avatar if no image */}
                            <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-500 font-bold text-xl uppercase">
                              {user.name?.charAt(0) || user.email.charAt(0)}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">{user.name || 'User'}</span>
                            <span className="text-xs text-gray-500">{user.country || 'Location not set'}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <Link
                            href="/favorites"
                            className="flex items-center gap-3 px-2 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
                          >
                            <Heart className="w-4 h-4" />
                            <span>View and share Favorite</span>
                          </Link>
                          {user.role === 'ADMIN' && (
                            <Link
                              href="/admin/dashboard"
                              className="flex items-center gap-3 px-2 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
                            >
                              <Lock className="w-4 h-4" />
                              <span>Admin Dashboard</span>
                            </Link>
                          )}
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-2 py-2 w-full text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Search Icon */}
              <button
                className="cursor-pointer text-gray-900 hover:text-gray-600"
                onClick={() => setShowSearch(!showSearch)}
              >
                <img src='/images/Icons/icon (2).png' className='w-7 h-7' alt="Search" />
              </button>

              {/* Cart Icon */}
              <Link href="/cart" className="relative">
                <button className="cursor-pointer text-gray-900 hover:text-gray-600">
                  <img src='/images/Icons/icon (1).png' className='w-7 h-7' alt="Cart" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {itemCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>

          {/* Search Input */}
          {showSearch && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-md py-3 px-4 z-40">
              <div className="max-w-7xl mx-auto flex items-center">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  className="w-full outline-none text-gray-900 placeholder-gray-400"
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="ml-2 cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation - Centered */}
        <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-12">
          {menuItems.map((menu) => (
            <div
              key={menu.id}
              className="relative"
              onMouseEnter={() => handleMenuEnter(menu.id)}
              onMouseLeave={handleMenuLeave}
            >
              <button
                onClick={menu.id === 'shop' ? handleShopClick : menu.id === 'partners' ? handlePartnersClick : () => setActiveMenu(menu.id)}
                className={`
                  cursor-pointer flex items-center space-x-1 text-sm tracking-wide transition-all duration-200
                  ${activeMenu === menu.id
                    ? 'font-bold text-gray-900'
                    : 'font-normal text-gray-900 hover:text-gray-600'
                  }
                  ${hoveredMenu === menu.id ? 'border-b-2 border-gray-900' : ''}
                `}
              >
                <span>{menu.label}</span>
              </button>

              {/* Dropdown Menu */}
              {hoveredMenu === menu.id && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50 border border-gray-100"
                  onMouseEnter={cancelLeaveTimeout}
                  onMouseLeave={handleMenuLeave}
                >
                  {menu.items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (item.onClick) {
                          item.onClick();
                        } else if (item.category) {
                          handleCategoryClick(item.category);
                        } else if (item.href) {
                          handleNavigation(item.href);
                        }
                      }}
                      className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </header>

      {/* About Us Popup Modal */}
      {showAboutPopup && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div
            ref={aboutPopupRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">STONLEAF</h2>
              <button
                onClick={() => setShowAboutPopup(false)}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area - Split Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Side - Image (60%) */}
              <div className="w-3/5 p-6 border-r border-gray-200 overflow-y-auto">
                <Image
                  src="/images/artwork_4.jpg"
                  alt="About Us"
                  width={500}
                  height={500}
                  className="w-full h-auto"
                />
              </div>

              {/* Right Side - Text (40%) */}
              <div className="w-2/5 p-6 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">ABOUT US</h3>
                    <div className="space-y-3">
                      <p className="text-gray-700 leading-relaxed">
                        Your home is a reflection of who you are. The colors you choose, the furniture you love, and the art you hang on your walls—it all tells a story. At Stonleaf, we exist to help you tell yours.
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        We are a team of curators and creators based in the United States, passionate about the power of visual storytelling.
                        Every print that leaves our facility is inspected for color accuracy, sharpness, and durability.
                      </p>
                      <p className="text-gray-700 leading-relaxed"> Whether you are redecorating your first apartment, styling a modern office, or looking for that perfect gift, Stonleaf provides the inspiration you need to make any space truly your own. </p>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Why Choose Stoneleaf?</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-gray-900 mr-2">•</span>
                        <span className="text-gray-700 text-sm">Global shipping with secure packaging</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-900 mr-2">•</span>
                        <span className="text-gray-700 text-sm">Curated collection of exclusive artworks</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-900 mr-2">•</span>
                        <span className="text-gray-700 text-sm">Direct support from the artist</span>
                      </li>
                    </ul>
                  </div>

                  {/* Call to Action */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-700 text-sm mb-4">
                      Join our community of art lovers and start your collection today.
                    </p>
                    <button
                      onClick={() => {
                        setShowAboutPopup(false);
                        router.push('/shop');
                      }}
                      className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium text-sm"
                    >
                      EXPLORE THE COLLECTION
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Popup Modal */}
      {showAuthPopup && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div
            ref={authPopupRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div></div>
                <button
                  onClick={() => {
                    setShowAuthPopup(null);
                    setAuthError(null);
                  }}
                  className="cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 uppercase">
                  {showAuthPopup === 'signin' ? 'SIGN IN' : showAuthPopup === 'forgot-password' ? 'FORGOT PASSWORD' : 'SIGN UP'}
                </h2>
                <p className="text-sm text-gray-600">
                  {showAuthPopup === 'signin'
                    ? 'Access your account'
                    : showAuthPopup === 'forgot-password'
                      ? 'Enter your email to reset password'
                      : 'Create a new account'}
                </p>
              </div>

              {/* Messages */}
              {authMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                  {authMessage}
                </div>
              )}
              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {authError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuthSubmit}>
                {showAuthPopup === 'signup' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {showAuthPopup === 'signup' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter Your Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Enter your country"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                {showAuthPopup !== 'forgot-password' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {showAuthPopup === 'signup' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="cursor-pointer w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                >
                  {isAuthLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    showAuthPopup === 'signin' ? 'Sign In' : showAuthPopup === 'forgot-password' ? 'Send Reset Link' : 'Create Account'
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    {showAuthPopup === 'signin' ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={switchAuthMode}
                      className="cursor-pointer text-gray-900 font-medium hover:underline"
                    >
                      {showAuthPopup === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <BecomeMarketerModal isOpen={isMarketerModalOpen} onClose={() => setIsMarketerModalOpen(false)} />
    </div>
  );
}