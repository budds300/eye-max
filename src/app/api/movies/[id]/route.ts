import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const movieId = resolvedParams.id

    if (!movieId || isNaN(parseInt(movieId))) {
      return NextResponse.json(
        { error: 'Valid movie ID is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.TMDB_API_KEY
    const baseURL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

    const response = await fetch(
      `${baseURL}/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos,images&language=en-US`
    )

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    )
  }
}










