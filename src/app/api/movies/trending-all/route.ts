import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const baseURL = process.env.TMDB_BASE_URL;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";

    if (!apiKey || !baseURL) {
      return NextResponse.json(
        { error: "API configuration missing" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `${baseURL}/trending/all/day?language=en-US&page=${page}&api_key=${apiKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching trending all:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending content" },
      { status: 500 },
    );
  }
}
