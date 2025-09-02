'use client'

import React, { useState, useEffect } from 'react'
import { Play, List } from 'lucide-react'
import { MovieGridSkeleton } from '@/components/ui/loader'
import { Button } from '@/components/ui/button'
import { MovieCard } from '@/components/MovieCard'
import { TVShowCard } from '@/components/TVShowCard'
import { movieService, Movie, TVShow } from '@/services/MovieService'
import { cn } from '@/lib/utils'

type ContentType = 'movies' | 'tv-shows'

export const TrendingSection: React.FC = () => {
  const [contentType, setContentType] = useState<ContentType>('movies')
  const [movies, setMovies] = useState<Movie[]>([])
  const [tvShows, setTVShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTrendingContent = async () => {
      setLoading(true)
      try {
        if (contentType === 'movies') {
          if (movies.length === 0) {
            // Use now playing movies for trending to ensure different content from popular
            const response = await movieService.getNowPlayingMovies()
            setMovies(response.results)
          }
        } else {
          if (tvShows.length === 0) {
            const response = await movieService.getTrendingTVShows()
            setTVShows(response.results)
          }
        }
                    } catch {
            // Handle error silently
          } finally {
        setLoading(false)
      }
    }

    fetchTrendingContent()
  }, [contentType, movies.length, tvShows.length])

  const currentContent = contentType === 'movies' ? movies : tvShows

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Now Playing & Trending</h2>

        {/* Tabs */}
        <div className="flex rounded-lg bg-gray-700 p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'rounded-md transition-all flex items-center space-x-2',
              contentType === 'movies'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-300 hover:text-white'
            )}
            onClick={() => setContentType('movies')}
          >
            <Play className="w-4 h-4" />
            <span>Movies</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'rounded-md transition-all flex items-center space-x-2',
              contentType === 'tv-shows'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-300 hover:text-white'
            )}
            onClick={() => setContentType('tv-shows')}
          >
            <List className="w-4 h-4" />
            <span>TV Shows</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <MovieGridSkeleton count={10} />
      ) : (
        <div
                     className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
                      {currentContent.slice(0, 10).map((item) => (
            <div key={item.id}>
              {contentType === 'movies' ? (
                <MovieCard movie={item as Movie} />
              ) : (
                <TVShowCard show={item as TVShow} />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
