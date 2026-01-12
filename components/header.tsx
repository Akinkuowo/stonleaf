'use client'

import { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingBag, ChevronDown, X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

type MenuId = 'shop' | 'partners' | 'sellers' | 'about' | null;
type AuthMode = 'signin' | 'signup' | null;

interface AuthResponse {
  success: boolean;
  error?: string;
  user?: any;
  token?: string;
}

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<MenuId>('shop');
  const [hoveredMenu, setHoveredMenu] = useState<MenuId>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState<AuthMode>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    country: ''
  });
  const [authError, setAuthError] = useState<string | null>(null);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const authPopupRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock dropdown data for each menu item
  const menuItems = [
    {
      id: 'shop' as const,
      label: 'SHOP',
      items: ['All', 'Canvas Art', 'Photo Art', 'Digital Art', 'AR Art']
    },
    {
      id: 'partners' as const,
      label: 'OUR PARTNERS',
      items: ['Artists', 'Collaborators']
    },
    {
      id: 'sellers' as const,
      label: 'JOIN OUR SELLERS',
      items: ['I am an Artist', 'I am a Marketer']
    },
    {
      id: 'about' as const,
      label: 'ABOUT',
      items: ['About Us', 'Blog', 'DIY Hang']
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
        // Store token in localStorage
        localStorage.setItem('token', data.token);

        // You might want to store user data in state or context
        console.log('User signed in:', data.user);

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
        // Store token in localStorage
        localStorage.setItem('token', data.token);

        console.log('User signed up:', data.user);

        return { success: true, user: data.user, token: data.token };
      } else {
        return { success: false, error: data.error || 'Sign up failed' };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Clear timeout on unmount
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (authError) setAuthError(null);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (showAuthPopup === 'signin') {
      const result = await signIn(formData.email, formData.password);
      if (result.success) {
        setShowAuthPopup(null);
        setFormData({ email: '', password: '', confirmPassword: '', name: '', country: '' });
        // You could trigger a page refresh or update user state here
        window.location.reload(); // Simple refresh to update UI
      } else {
        setAuthError(result.error || 'Sign in failed');
      }
    } else {
      // Sign up validation
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
        window.location.reload(); // Simple refresh to update UI
      } else {
        setAuthError(result.error || 'Sign up failed');
      }
    }
  };

  const switchAuthMode = () => {
    setShowAuthPopup(showAuthPopup === 'signin' ? 'signup' : 'signin');
    setAuthError(null);
    // Clear password fields when switching modes
    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
  };

  const openAuthPopup = (mode: AuthMode) => {
    setShowAuthPopup(mode);
    setUserDropdownOpen(false);
    setAuthError(null);
  };

  // Function to handle menu mouse enter
  const handleMenuEnter = (menuId: MenuId) => {
    // Clear any existing timeout to prevent premature closure
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setHoveredMenu(menuId);
  };

  // Function to handle menu mouse leave with delay
  const handleMenuLeave = () => {
    // Set a timeout to close the menu after 5 seconds
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null);
      leaveTimeoutRef.current = null;
    }, 2000); // 5000 milliseconds = 5 seconds
  };

  // Function to handle user dropdown mouse enter
  const handleUserDropdownEnter = () => {
    // Clear any existing timeout to prevent premature closure
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setUserDropdownOpen(true);
  };

  // Function to handle user dropdown mouse leave with delay
  const handleUserDropdownLeave = () => {
    // Set a timeout to close the dropdown after 5 seconds
    leaveTimeoutRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
      leaveTimeoutRef.current = null;
    }, 2000); // 5000 milliseconds = 5 seconds
  };

  // Function to cancel leave timeout when re-entering dropdown area
  const cancelLeaveTimeout = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  return (
    <div className="bg-white h-[12rem]">
      {/* Top Banner */}
      <div className="bg-black text-white text-center py-4 text-sm">
        VISIT OUR STORE <a href="shop" className="text-white underline">HERE</a>
      </div>

      {/* Header */}
      <header className="bg-white px-14 py-4 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">STONLEAF</h1>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              {/* User Icon with Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  className="cursor-pointer text-gray-900 hover:text-gray-600 relative"
                  onMouseEnter={handleUserDropdownEnter}
                >

                  <img src='images/icons/icon (3).png' className='w-7 h-7' />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div
                    className="absolute top-full right-[-10] mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50 border border-gray-100"
                    onMouseEnter={cancelLeaveTimeout}
                    onMouseLeave={handleUserDropdownLeave}
                  >
                    <button
                      onClick={() => openAuthPopup('signin')}
                      className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => openAuthPopup('signup')}
                      className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>

              {/* Search Icon */}
              <button
                className="cursor-pointer text-gray-900 hover:text-gray-600"
                onClick={() => setShowSearch(!showSearch)}
              >
                <img src='images/icons/icon (2).png' className='w-7 h-7' />
              </button>

              {/* Cart Icon */}
              <Link href="/cart">
                <button className="cursor-pointer text-gray-900 hover:text-gray-600">
                  <img src='images/icons/icon (1).png' className='w-7 h-7' />
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
                onClick={() => setActiveMenu(menu.id)}
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
                    <a
                      key={index}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </header>

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
                <h2 className="text-2xl font-bold text-gray-900">
                  {showAuthPopup === 'signin' ? 'SIGN IN' : 'SIGN UP'}
                </h2>
                <p className="text-sm text-gray-600">{showAuthPopup === 'signin' ? 'Access your account' : 'Create a new account'}</p>
              </div>

              {/* Error Message */}
              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {authError}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAuthSubmit}>
                {showAuthPopup === 'signup' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your email
                  </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter Your Country
                    </label>
                    <div className="relative">
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
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
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

                {showAuthPopup === 'signup' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                  </div>
                )}

                <button
                  type="submit"
                  className="cursor-pointer w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium"
                >
                  {showAuthPopup === 'signin' ? 'Sign In' : 'Create Account'}
                </button>

                {/* Switch between sign in/sign up */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    {showAuthPopup === 'signin'
                      ? "Don't have an account? "
                      : "Already have an account? "
                    }
                    <button
                      type="button"
                      onClick={switchAuthMode}
                      className="cursor-pointer text-gray-900 font-medium hover:underline"
                    >
                      {showAuthPopup === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>

                {/* Terms and Policy */}
                {showAuthPopup === 'signup' && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                      By clicking "Create Account", you accept Stoneleaf's Terms of Service and Privacy Policy.
                      This site uses encryption and the Google Privacy Policy on Forms of Service apply.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}