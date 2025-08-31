'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Play, List } from 'lucide-react'
import { MovieGridSkeleton } from '@/components/ui/loader'
import { Button } from '@/components/ui/button'
import { TVShowCard } from '@/components/TVShowCard'
import { movieService, TVShow } from '@/services/MovieService'
import { cn } from '@/lib/utils'

export const LatestTVShows: React.FC = () => {
  const [tvShows, setTvShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestTVShows = async () => {
      try {
        setLoading(true)
        const response = await movieService.getTrendingTVShows(1)
        
        // Validate the response structure
        if (response && response.results && Array.isArray(response.results)) {
                  const validTvShows = response.results
          .filter(tvShow => tvShow && tvShow.id) // Filter out invalid items
          .slice(0, 20)
          setTvShows(validTvShows)
        } else {
          console.error('Invalid response structure:', response)
          setError('Invalid data received from server')
        }
      } catch (err) {
        setError('Failed to load latest TV shows')
        console.error('Error fetching latest TV shows:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestTVShows()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (loading) {
    return <MovieGridSkeleton count={20} />
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="text-red-500 text-4xl">⚠️</div>
          <p className="text-lg font-semibold text-white">Error loading TV shows</p>
          <p className="text-sm text-gray-400">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (tvShows.length === 0 && !loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-white">No TV shows found</p>
          <p className="text-sm text-gray-400">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <List className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Latest TV Shows</h2>
          </div>
          <Button variant="outline" className="border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white">
            View All
          </Button>
        </div>

                 {/* TV Shows Grid */}
         <motion.div
           variants={containerVariants}
           initial="hidden"
           animate="visible"
           className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
         >
           {tvShows.filter(tvShow => tvShow && tvShow.id).map((tvShow) => (
             <TVShowCard key={tvShow.id} show={tvShow} />
           ))}
         </motion.div>
      </div>
    </section>
  )
}
