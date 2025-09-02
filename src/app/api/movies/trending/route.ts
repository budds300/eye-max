import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const type = searchParams.get("type") || "movies";

    const apiKey = process.env.TMDB_API_KEY;
    const baseURL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

    let endpoint = "";
    let params: Record<string, string> = {
      api_key: apiKey!,
      page,
      language: "en-US",
    };

    if (type === "movies") {
      endpoint = "/discover/movie";
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate(),
      );
      const maxDate = new Date(
        today.getFullYear() + 1,
        today.getMonth(),
        today.getDate(),
      );

      params = {
        ...params,
        sort_by: "popularity.desc",
        with_release_type: "2|3",
        "release_date.gte": minDate.toISOString().split("T")[0],
        "release_date.lte": maxDate.toISOString().split("T")[0],
      };
    } else {
      endpoint = "/discover/tv";
      params = {
        ...params,
        include_adult: "false",
        include_null_first_air_dates: "false",
        sort_by: "popularity.desc",
      };
    }

    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${baseURL}${endpoint}?${queryString}`);

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching trending content:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending content" },
      { status: 500 },
    );
  }
}
