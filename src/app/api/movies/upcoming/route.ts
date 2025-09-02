import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";

    const apiKey = process.env.TMDB_API_KEY;
    const baseURL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

    // Calculate date range for upcoming movies
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate(),
    );
    const maxDate = new Date(today.getFullYear() + 1, 4, 1); // May 1st, 2025

    const params = new URLSearchParams({
      api_key: apiKey!,
      include_adult: "false",
      include_video: "false",
      language: "en-US",
      page,
      sort_by: "popularity.desc",
      with_release_type: "2|3",
      "release_date.gte": minDate.toISOString().split("T")[0],
      "release_date.lte": maxDate.toISOString().split("T")[0],
    });

    const response = await fetch(`${baseURL}/discover/movie?${params}`);

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming movies" },
      { status: 500 },
    );
  }
}
