import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const page = searchParams.get('page') || '1'

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.TMDB_API_KEY
    const baseURL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

    const response = await fetch(
      `${baseURL}/search/tv?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
    )

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error searching TV shows:', error)
    return NextResponse.json(
      { error: 'Failed to search TV shows' },
      { status: 500 }
    )
  }
}
