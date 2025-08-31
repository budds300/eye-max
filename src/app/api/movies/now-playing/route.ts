import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'

    const apiKey = process.env.TMDB_API_KEY
    const baseURL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

    const response = await fetch(`${baseURL}/movie/now_playing?api_key=${apiKey}&page=${page}&language=en-US`)

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching now playing movies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch now playing movies' },
      { status: 500 }
    )
  }
}






