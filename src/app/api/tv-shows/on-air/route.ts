import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'

    const apiKey = process.env.TMDB_API_KEY
    const baseURL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'

    const response = await fetch(
      `${baseURL}/tv/on_the_air?api_key=${apiKey}&language=en-US&page=${page}`
    )

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching on-air TV shows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch on-air TV shows' },
      { status: 500 }
    )
  }
}
