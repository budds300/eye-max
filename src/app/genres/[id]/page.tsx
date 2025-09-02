'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { MovieGridSkeleton } from '@/components/ui/loader'
import { MovieCard } from '@/components/MovieCard'
import { movieService, Movie, Genre } from '@/services/MovieService'

export default function GenrePage() {
  const params = useParams()
  const genreId = params.id as string
  const [movies, setMovies] = useState<Movie[]>([])
  const [genre, setGenre] = useState<Genre | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        setLoading(true)
        
        // Fetch genre details
        const genresResponse = await movieService.getGenres()
        const currentGenre = genresResponse.genres.find(g => g.id.toString() === genreId)
        setGenre(currentGenre || null)
        
        // Fetch movies by genre
        const response = await fetch(`/api/movies/genre/${genreId}?page=1`)
        if (!response.ok) {
          throw new Error('Failed to fetch movies by genre')
        }
        const data = await response.json()
        setMovies(data.results)
      } catch {
        setError('Failed to load genre movies')
      } finally {
        setLoading(false)
      }
    }

    if (genreId) {
      fetchGenreMovies()
    }
  }, [genreId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Loading...</h1>
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
        <h1 className="text-3xl font-bold mb-8">
          {genre ? `${genre.name} Movies` : 'Genre Movies'}
        </h1>
        
        {movies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-400">No movies found for this genre.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.slice(0, 20).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
