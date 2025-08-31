'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, Film } from 'lucide-react'
import { movieService, Genre } from '@/services/MovieService'

export const GenresDropdown: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true)
        const response = await movieService.getGenres()
        setGenres(response.genres)
      } catch (error) {
        console.error('Error fetching genres:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-white hover:text-teal-400 transition-colors"
      >
        <Film className="w-4 h-4" />
        <span>Genres</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            {loading ? (
              <div className="text-gray-400 text-sm p-2">Loading genres...</div>
            ) : (
              <div className="grid grid-cols-1 gap-1">
                {genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genres/${genre.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}






