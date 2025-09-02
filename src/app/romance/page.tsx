'use client'

import React from 'react'
import { MovieList } from '@/components/MovieList'

export default function RomanceMoviesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Romance Movies</h1>
          <p className="text-gray-400">Fall in love with romantic stories</p>
        </div>
        
        <MovieList category="romance" />
      </div>
    </div>
  )
}










