'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TVShowCard } from './TVShowCard'
import { Pagination } from './Pagination'
import { movieService, TVShow } from '@/services/MovieService'
import { PageLoader } from './ui/loader'

interface TVShowListProps {
  category: 'popular' | 'top-rated' | 'on-air' | 'search'
  searchQuery?: string
}

export const TVShowList: React.FC<TVShowListProps> = ({ category, searchQuery }) => {
  const [shows, setShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let response
        if (category === 'search' && searchQuery) {
          response = await movieService.searchTVShows(searchQuery, currentPage)
        } else {
          switch (category) {
            case 'popular':
              response = await movieService.getPopularTVShows(currentPage)
              break
            case 'top-rated':
              response = await movieService.getTopRatedTVShows(currentPage)
              break
            case 'on-air':
              response = await movieService.getOnAirTVShows(currentPage)
              break
            default:
              response = await movieService.getPopularTVShows(currentPage)
          }
        }
        
        setShows(response.results)
        setTotalPages(Math.min(response.total_pages, 500)) // TMDB limits to 500 pages
      } catch (err) {
        setError('Failed to load TV shows')
        console.error('Error fetching TV shows:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [category, searchQuery, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return <PageLoader message="Loading TV shows..." />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-xl mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (shows.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-xl mb-4">No TV shows found</div>
        <p className="text-gray-500">Try adjusting your search criteria</p>
      </div>
    )
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        {shows.map((show, index) => (
          <motion.div
            key={show.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <TVShowCard show={show} />
          </motion.div>
        ))}
      </motion.div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}




