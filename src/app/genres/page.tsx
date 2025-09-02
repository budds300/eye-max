'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MovieGridSkeleton } from '@/components/ui/loader'
import { movieService, Genre } from '@/services/MovieService'

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true)
        const response = await movieService.getGenres()
        setGenres(response.genres)
      } catch {
        setError('Failed to load genres')
      } finally {
        setLoading(false)
      }
    }

    fetchGenres()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Movie Genres</h1>
          <MovieGridSkeleton count={20} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-white text-xl mb-2">Error</div>
          <div className="text-gray-400">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Movie Genres</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre) => (
            <Link key={genre.id} href={`/genres/${genre.id}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-700 transition-colors"
              >
                <h2 className="text-lg font-semibold text-teal-400">{genre.name}</h2>
                <p className="text-sm text-gray-400 mt-2">Explore {genre.name} movies</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}








