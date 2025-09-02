'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { SearchBar } from './SearchBar'
import { useAuth } from '@/contexts/AuthContext'

export const Navigation: React.FC = () => {
  const { currentUser, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsUserDropdownOpen(false)
    } catch {
      // Handle error silently
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left Side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="bg-teal-500 text-white px-4 py-2 rounded font-bold hover:bg-teal-600 transition-colors">
              EYEMAX
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/movies" className="text-gray-300 hover:text-white transition-colors">
                Movies
              </Link>
              <Link href="/tv-shows" className="text-gray-300 hover:text-white transition-colors">
                TV Shows
              </Link>
            </nav>
          </div>

          {/* Right Side - Search and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchBar className="w-64" />
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Menu */}
            {currentUser ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 text-white hover:text-teal-400 transition-colors"
                >
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                    {currentUser?.photoURL ? (
                      <Image 
                        src={currentUser.photoURL} 
                        alt={currentUser.displayName || 'User'} 
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm">
                    {currentUser.displayName || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg border border-gray-600 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-600">
                      <p className="text-sm text-gray-300">
                        Signed in as
                      </p>
                      <p className="text-sm font-medium text-white truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-left text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button for non-authenticated users */
              <Link
                href="/auth/signin"
                className="flex items-center space-x-2 text-white hover:text-teal-400 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden mt-4">
            <SearchBar className="w-full" />
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-gray-700">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/movies" 
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Movies
              </Link>
              <Link 
                href="/tv-shows" 
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                TV Shows
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
