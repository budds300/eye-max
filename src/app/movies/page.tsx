'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SearchBar } from '@/components/SearchBar'
import { MovieList } from '@/components/MovieList'
import { Button } from '@/components/ui/button'
import { useMovieStore } from '@/store/movieStore'
import { movieService, Movie } from '@/services/MovieService'
import { cn } from '@/lib/utils'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export default function MoviesPage() {
  const { searchQuery } = useMovieStore()
  const [activeCategory, setActiveCategory] = useState<'popular' | 'top-rated' | 'now-playing' | 'upcoming'>('popular')
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await movieService.getTrendingMovies()
        setTrendingMovies(response.results.slice(0, 5))
                  } catch {
          // Handle error silently
        }
    }

    fetchTrendingMovies()
  }, [])

  const categories = [
    { id: 'popular', label: 'Popular' },
    { id: 'top-rated', label: 'Top Rated' },
    { id: 'now-playing', label: 'Now Playing' },
    { id: 'upcoming', label: 'Upcoming' },
  ] as const

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />

      {!searchQuery && trendingMovies.length > 0 && (
        <section className="relative h-[60vh] bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="absolute inset-0 bg-opacity-50"></div>
          <div className="relative container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-5xl font-bold mb-4">Movies</h1>
              <p className="text-xl text-gray-300 mb-8">
                Discover the latest and greatest films
              </p>
              <div className="flex justify-center">
                <SearchBar className="w-full max-w-md" />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <main className="container mx-auto px-4 py-8">
        {searchQuery && (
          <section className="mb-8">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-4 text-center text-3xl font-bold text-white">
                Search Movies
              </h2>
              <p className="mb-6 text-center text-gray-400">
                Find your favorite movies
              </p>
              <SearchBar className="w-full" />
            </div>
          </section>
        )}

        {!searchQuery && (
          <section className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "transition-all duration-200",
                    activeCategory === category.id 
                      ? "bg-teal-500 hover:bg-teal-600" 
                      : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  )}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </section>
        )}

        <section>
          {searchQuery ? (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-white">
                Search Results for &quot;{searchQuery}&quot;
              </h2>
              <MovieList category="search" searchQuery={searchQuery} />
            </div>
          ) : (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-white">
                {categories.find(c => c.id === activeCategory)?.label} Movies
              </h2>
              <MovieList category={activeCategory} />
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

