'use client'

import React from 'react'
import { TVShowDetails } from '@/components/TVShowDetails'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

interface TVShowPageProps {
  params: {
    id: string
  }
}

export default function TVShowPage({ params }: TVShowPageProps) {
  const tvShowId = parseInt(params.id)

  if (isNaN(tvShowId)) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Invalid TV Show ID</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <TVShowDetails tvShowId={tvShowId} />
      <Footer />
    </div>
  )
}




