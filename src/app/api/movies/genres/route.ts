import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.TMDB_API_KEY
    const baseURL = process.env.TMDB_BASE_URL

    if (!apiKey || !baseURL) {
      return NextResponse.json(
        { error: 'API configuration missing' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `${baseURL}/genre/movie/list?language=en&api_key=${apiKey}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
        } catch {
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    )
  }
}








