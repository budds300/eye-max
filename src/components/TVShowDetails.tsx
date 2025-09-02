'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Star, ThumbsUp, ThumbsDown, Play, Calendar, MapPin, Users, Tag, Clock } from 'lucide-react'
import { movieService, TVShow, TVShowDetails as TVShowDetailsType, CastMember } from '@/services/MovieService'

import { cn } from '@/lib/utils'

interface TVShowDetailsProps {
  tvShowId: number
}

export const TVShowDetails: React.FC<TVShowDetailsProps> = ({ tvShowId }) => {
  const [show, setShow] = useState<TVShowDetailsType | null>(null)
  const [recommendations, setRecommendations] = useState<TVShow[]>([])
  const [cast, setCast] = useState<CastMember[]>([])
  const [videos, setVideos] = useState<{ key: string; site: string; type: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userLiked, setUserLiked] = useState<boolean | null>(null)
  const [userRating, setUserRating] = useState<number>(0)

  useEffect(() => {
    const fetchShowData = async () => {
      try {
        setLoading(true)
        const [showData, recommendationsData, castData, videosData] = await Promise.all([
          movieService.getTVShowDetails(tvShowId),
          movieService.getTVShowRecommendations(tvShowId, 1),
          movieService.getTVShowCredits(tvShowId),
          fetchTVShowVideos(tvShowId)
        ])
        
        setShow(showData)
        
        // Filter recommendations to show TV shows with similar names
        const similarShows = filterSimilarTVShows(recommendationsData.results, showData.name)
        setRecommendations(similarShows.slice(0, 6)) // Show 6 recommendations in 2 rows of 3
        
        setCast(castData.cast.slice(0, 10)) // Show top 10 cast members
        setVideos(videosData)
      } catch {
        setError('Failed to load TV show details')
      } finally {
        setLoading(false)
      }
    }

    fetchShowData()
  }, [tvShowId])



  // Function to fetch TV show videos/trailers
  const fetchTVShowVideos = async (tvShowId: number) => {
    try {
      const response = await fetch(`/api/tv-shows/${tvShowId}/videos`)
      if (!response.ok) {
        throw new Error('Failed to fetch TV show videos')
      }
      const data = await response.json()
      
      // Filter for official trailers from YouTube
      const officialTrailer = data.results.filter((trailer: { type: string; site: string }) => 
        trailer.type === "Trailer" && trailer.site === "YouTube"
      )
      
      // Return the first official trailer, or null if none found
      return officialTrailer.length > 0 ? officialTrailer[0] : null
    } catch {
      return null
    }
  }

  // Function to filter TV shows with similar names
  const filterSimilarTVShows = (shows: TVShow[], currentName: string) => {
    if (!currentName) return shows
    
    const currentWords = currentName.toLowerCase().split(/\s+/)
    
    // First try to find shows with at least 2 matching words
    let similarShows = shows.filter(show => {
      const showWords = show.name.toLowerCase().split(/\s+/)
      
      const commonWords = currentWords.filter(word => 
        showWords.some(showWord => 
          showWord.includes(word) || word.includes(showWord)
        )
      )
      
      return commonWords.length >= 2
    })
    
    // If no shows found with 2+ matches, try with 1+ match
    if (similarShows.length === 0) {
      similarShows = shows.filter(show => {
        const showWords = show.name.toLowerCase().split(/\s+/)
        
        const commonWords = currentWords.filter(word => 
          showWords.some(showWord => 
            showWord.includes(word) || word.includes(showWord)
          )
        )
        
        return commonWords.length >= 1
      })
    }
    
    // If still no shows found, return original list (fallback)
    if (similarShows.length === 0) {
      return shows
    }
    
    // Sort by similarity score
    return similarShows.sort((a, b) => {
      const aWords = a.name.toLowerCase().split(/\s+/)
      const bWords = b.name.toLowerCase().split(/\s+/)
      
      const aScore = currentWords.filter(word => 
        aWords.some(showWord => 
          showWord.includes(word) || word.includes(showWord)
        )
      ).length
      
      const bScore = currentWords.filter(word => 
        bWords.some(showWord => 
          showWord.includes(word) || word.includes(showWord)
        )
      ).length
      
      return bScore - aScore // Higher score first
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (error || !show) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">{error || 'TV Show not found'}</div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getQualityBadge = (voteAverage: number) => {
    return voteAverage >= 7.0 ? 'HD' : 'CAM'
  }

  const getQualityBadgeColor = (voteAverage: number) => {
    return voteAverage >= 7.0 ? 'bg-green-500' : 'bg-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-2">
        <div className="text-gray-400 text-sm">
          Home / TV Shows / {show.name}
        </div>
      </div>

      {/* Trailer Section */}
      {videos && (
        <div id="trailer-section" className="container mx-auto px-4 py-8">
          <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-800">
            <iframe
              src={`https://www.youtube.com/embed/${videos.key}`}
              title={`${show.name} Trailer`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* TV Show Poster */}
              <div className="relative w-64 h-96 flex-shrink-0">
                <Image
                  src={movieService.getImageURL(show.poster_path, 'w500')}
                  alt={show.name}
                  fill
                  className="rounded-lg object-cover"
                />
                <div className="absolute inset-0  bg-opacity-5 rounded-lg flex items-center justify-center hover:bg-opacity-10 transition-all duration-200">
                  {videos ? (
                    <div 
                      className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer"
                      onClick={() => {
                        // Scroll to trailer section
                        const trailerSection = document.getElementById('trailer-section')
                        if (trailerSection) {
                          trailerSection.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    )}
                </div>
              </div>

              {/* TV Show Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-white">{show.name}</h1>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-2">Score: {userRating || 0} / 5 rated</div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setUserLiked(true)}
                        className={cn(
                          "p-2 rounded",
                          userLiked === true ? "bg-green-500" : "bg-gray-700 hover:bg-gray-600"
                        )}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setUserLiked(false)}
                        className={cn(
                          "p-2 rounded",
                          userLiked === false ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"
                        )}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Rating Stars */}
                    <div className="flex items-center space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setUserRating(star)}
                          className={cn(
                            "text-lg transition-colors",
                            star <= userRating ? "text-yellow-400" : "text-gray-400 hover:text-yellow-300"
                          )}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metadata Bar */}
                <div className="flex items-center space-x-4 mb-4">
                  <span className={cn("px-2 py-1 rounded text-xs font-bold", getQualityBadgeColor(show.vote_average))}>
                    {getQualityBadge(show.vote_average)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{show.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(show.first_air_date)}</span>
                  </div>
                </div>

                {/* Synopsis */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {show.overview}
                </p>

                {/* Detailed Information */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Country:</span>
                    <span>{show.origin_country?.join(', ') || 'United States'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Genre:</span>
                    <span>{show.genres?.map(g => g.name).join(', ') || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">First Aired:</span>
                    <span>{formatDate(show.first_air_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Status:</span>
                    <span>{show.status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Seasons:</span>
                    <span>{show.number_of_seasons}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      `Watch ${show.name} Online Free`,
                      `${show.name} Online Free`,
                      `Where to watch ${show.name}`,
                      `${show.name} TV show free online`,
                      `${show.name} free online`
                    ].map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-700 rounded-full text-xs hover:bg-gray-600 cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cast Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Cast</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {cast.map((member) => (
                      <div key={member.id} className="bg-gray-800 rounded-lg p-3 text-center">
                        <div className="relative w-16 h-16 mx-auto mb-2">
                          <Image
                            src={movieService.getProfileURL(member.profile_path || '')}
                            alt={member.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{member.name}</h4>
                        <p className="text-xs text-gray-400">{member.character}</p>
                      </div>
                    ))}
                  </div>
                </div>

              
              </div>
            </div>
          </div>

          {/* Right Sidebar - You May Also Like */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">You May Also Like</h3>
            
            {/* Debug Info */}
            <div className="text-xs text-gray-400 mb-2">
              Found {recommendations.length} recommendations
            </div>
            
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className="relative">
                      <Image
                        src={movieService.getImageURL(rec.poster_path, 'w200')}
                        alt={rec.name}
                        width={200}
                        height={300}
                        className="w-full h-32 object-cover"
                      />
                      <span className={cn(
                        "absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold",
                        getQualityBadgeColor(rec.vote_average)
                      )}>
                        {getQualityBadge(rec.vote_average)}
                      </span>
                    </div>
                    <div className="p-2">
                      <h4 className="font-semibold text-xs mb-1 line-clamp-2">{rec.name}</h4>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="text-xs">{new Date(rec.first_air_date).getFullYear()}</span>
                        <span className="px-1 py-0.5 bg-gray-700 rounded text-xs">TV Show</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">🎬</div>
                <p className="text-sm">No similar TV shows found</p>
                <p className="text-xs mt-1">Try viewing upcoming movies or now showing movies</p>
                <div className="mt-4 space-y-2">
                  <Link 
                    href="/upcoming" 
                    className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    View Upcoming Movies
                  </Link>
                  <Link 
                    href="/movies" 
                    className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors ml-2"
                  >
                    View Now Showing
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
