'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, User, LogOut } from 'lucide-react'
import { SearchBar } from './SearchBar'
import { useAuth } from '@/contexts/AuthContext'

export const Navigation: React.FC = () => {
  const { currentUser, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const handleAuthClick = async () => {
    if (currentUser) {
      try {
        await logout()
      } catch (error) {
        console.error('Error logging out:', error)
      }
    } else {
      // Navigate to sign in page
      window.location.href = '/auth/signin'
    }
  }

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

          {/* Right Side - Search and Login */}
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

            {/* Auth Button */}
                  <button
              onClick={handleAuthClick}
              className="flex items-center space-x-2 text-white hover:text-teal-400 transition-colors"
            >
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                {currentUser?.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <User className="w-4 h-4" />
              )}
            </div>
              <span className="hidden sm:inline">
                {currentUser ? currentUser.displayName || 'Logout' : 'Login'}
              </span>
              {currentUser && <LogOut className="w-4 h-4 hidden sm:inline" />}
            </button>

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
