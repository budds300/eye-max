'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Play, Calendar } from 'lucide-react'
import { TVShow } from '@/services/MovieService'
import { movieService } from '@/services/MovieService'

interface TVShowCardProps {
  show: TVShow
}

export const TVShowCard: React.FC<TVShowCardProps> = ({ show }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).getFullYear()
  }

  const getQualityBadge = (voteAverage: number) => {
    return voteAverage >= 7.0 ? 'HD' : 'CAM'
  }

  const getQualityBadgeColor = (voteAverage: number) => {
    return voteAverage >= 7.0 ? 'bg-green-500' : 'bg-gray-800'
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/tv-show/${show.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={movieService.getImageURL(show.poster_path, 'w500')}
            alt={show.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Quality Badge */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${getQualityBadgeColor(show.vote_average)}`}>
            {getQualityBadge(show.vote_average)}
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>

          {/* Rating */}
          <div className="absolute bottom-2 left-2 flex items-center space-x-1 bg-black bg-opacity-70 px-2 py-1 rounded">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">
              {show.vote_average.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 group-hover:text-teal-400 transition-colors">
            {show.name}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(show.first_air_date)}</span>
            </div>
            <span className="px-2 py-1 bg-gray-700 rounded text-xs">TV Show</span>
          </div>

          {show.overview && (
            <p className="text-gray-400 text-xs mt-2 line-clamp-2">
              {show.overview}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
