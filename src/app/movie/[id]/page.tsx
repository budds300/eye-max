'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { MovieDetails } from '@/components/MovieDetails'
import { Footer } from '@/components/Footer'

export default function MoviePage() {
  const params = useParams()
  const movieId = parseInt(params.id as string, 10)

  if (isNaN(movieId)) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">Invalid Movie ID</h1>
          <p className="text-gray-400">
            The movie ID provided is not valid.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* <Navigation /> */}
      <MovieDetails movieId={movieId} />
      <Footer />
    </div>
  )
}

