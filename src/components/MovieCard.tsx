'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Movie } from '@/services/MovieService'
import { cn } from '@/lib/utils'

interface MovieCardProps {
  movie: Movie
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getQualityBadge = (voteAverage: number) => {
    return voteAverage >= 7.0 ? 'HD' : 'CAM'
  }

  const getQualityBadgeColor = (voteAverage: number) => {
    return voteAverage >= 7.0 ? 'bg-blue-500' : 'bg-gray-800'
  }

  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="group cursor-pointer">
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          {/* Movie Poster */}
          <div className="relative aspect-[2/3]">
            <Image
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : '/placeholder-movie.jpg'}
              alt={movie.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Quality Badge */}
            <div className={cn(
              "absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold",
              getQualityBadgeColor(movie.vote_average)
            )}>
              {getQualityBadge(movie.vote_average)}
            </div>
          </div>

          {/* Movie Info */}
          <div className="p-3">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors text-white">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span className="px-2 py-1 bg-gray-700 rounded text-xs text-white">Movie</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
