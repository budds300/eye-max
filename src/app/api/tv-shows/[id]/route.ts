import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const tvShowId = resolvedParams.id;

    if (!tvShowId || isNaN(parseInt(tvShowId))) {
      return NextResponse.json(
        { error: "Valid TV show ID is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.TMDB_API_KEY;
    const baseURL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

    const response = await fetch(
      `${baseURL}/tv/${tvShowId}?api_key=${apiKey}&language=en-US&append_to_response=credits,recommendations`,
    );

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return NextResponse.json(
      { error: "Failed to fetch TV show details" },
      { status: 500 },
    );
  }
}
