'use client'

import React, { useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { MovieGridSkeleton } from '@/components/ui/loader'
import { MovieCard } from '@/components/MovieCard'
import { Button } from '@/components/ui/button'
import { useMovieStore } from '@/store/movieStore'
import { movieService } from '@/services/MovieService'
import { cn } from '@/lib/utils'

interface MovieListProps {
  category?: 'popular' | 'top-rated' | 'now-playing' | 'upcoming' | 'search' | 'action' | 'comedy' | 'drama' | 'horror' | 'romance' | 'sci-fi'
  searchQuery?: string
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const MovieList: React.FC<MovieListProps> = ({
  category = 'popular',
  searchQuery,
  className = '',
}) => {

  
  const {
    movies,
    searchResults,

    loading,
    error,
    searchLoading,
    searchError,
    setMovies,
    setSearchResults,
    setLoading,
    setError,
    setSearchLoading,
    setSearchError,
  } = useMovieStore()

  const isSearchMode = category === 'search' && searchQuery
  const displayMovies = isSearchMode ? searchResults : movies
  const displayLoading = isSearchMode ? searchLoading : loading
  const displayError = isSearchMode ? searchError : error


  const fetchMovies = useCallback(async (pageNum: number, append = false) => {
    try {
      let results
      
      if (isSearchMode && searchQuery) {
        results = await movieService.searchMovies(searchQuery, pageNum)
        if (append) {
          setSearchResults({
            ...results,
            results: [...searchResults, ...results.results],
          })
        } else {
          setSearchResults(results)
        }
      } else {
        switch (category) {
          case 'popular':
            results = await movieService.getPopularMovies(pageNum)
            break
          case 'top-rated':
            results = await movieService.getTopRatedMovies(pageNum)
            break
          case 'now-playing':
            results = await movieService.getNowPlayingMovies(pageNum)
            break
          case 'upcoming':
            results = await movieService.getUpcomingMovies(pageNum)
            break
          case 'action':
            results = await fetch(`/api/movies/genre/28?page=${pageNum}`).then(res => res.json())
            break
          case 'comedy':
            results = await fetch(`/api/movies/genre/35?page=${pageNum}`).then(res => res.json())
            break
          case 'drama':
            results = await fetch(`/api/movies/genre/18?page=${pageNum}`).then(res => res.json())
            break
          case 'horror':
            results = await fetch(`/api/movies/genre/27?page=${pageNum}`).then(res => res.json())
            break
          case 'romance':
            results = await fetch(`/api/movies/genre/10749?page=${pageNum}`).then(res => res.json())
            break
          case 'sci-fi':
            results = await fetch(`/api/movies/genre/878?page=${pageNum}`).then(res => res.json())
            break
          default:
            results = await movieService.getPopularMovies(pageNum)
        }
        
        if (append) {
          setMovies({
            ...results,
            results: [...movies, ...results.results],
          })
        } else {
          setMovies(results)
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch movies'
      if (isSearchMode) {
        setSearchError(errorMessage)
      } else {
        setError(errorMessage)
      }
    }
  }, [category, searchQuery, isSearchMode, movies, setMovies, setError, setSearchError, searchResults, setSearchResults])

  useEffect(() => {
    if (isSearchMode && searchQuery) {
      setSearchLoading(true)
      fetchMovies(1)
    } else if (!isSearchMode) {
      setLoading(true)
      fetchMovies(1)
    }
  }, [category, searchQuery, isSearchMode, setSearchLoading, setLoading, fetchMovies])



  if (displayLoading && displayMovies.length === 0) {
    return <MovieGridSkeleton count={20} />
  }

  if (displayError && displayMovies.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-lg font-semibold">Error loading movies</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{displayError}</p>
          <Button
            onClick={() => fetchMovies(1)}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (displayMovies.length === 0 && !displayLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">No movies found</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isSearchMode ? 'Try a different search term' : 'Please try again later'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {displayMovies.slice(10, 30).map((movie) => (
           <MovieCard key={movie.id} movie={movie} />
         ))}

        </div>
      </motion.div>

      
    </div>
  )
}
