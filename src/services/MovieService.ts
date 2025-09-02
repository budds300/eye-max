import axios from "axios";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
}

export interface TVShowDetails extends TVShow {
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: Array<{
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    air_date: string;
    episode_count: number;
  }>;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
  spoken_languages: Array<{ english_name: string; iso_639_1: string }>;
  status: string;
  type: string;
  last_air_date: string;
  in_production: boolean;
  created_by: Array<{ id: number; name: string; profile_path: string | null }>;
  networks: Array<{ id: number; name: string; logo_path: string | null }>;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
  }>;
  spoken_languages: Array<{ english_name: string; iso_639_1: string }>;
  status: string;
  budget: number;
  revenue: number;
  homepage: string;
  tagline: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Generic API response type
export interface APIResponse<T> {
  data: T;
  timestamp: number;
}

// Generic parameters type for API requests
export interface APIParams {
  [key: string]: string | number | boolean | undefined;
}

export interface TVSearchResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

class MovieService {
  private baseURL: string;
  private apiKey: string;
  private imageBaseURL: string;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private initialized = false;

  constructor() {
    // Initialize with defaults, will be updated on first use
    this.baseURL = "https://api.themoviedb.org/3";
    this.apiKey = "";
    this.imageBaseURL = "https://image.tmdb.org/t/p";
  }

  private initialize() {
    if (!this.initialized) {
      this.baseURL =
        process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
      this.apiKey = process.env.TMDB_API_KEY || "";
      this.imageBaseURL =
        process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
      this.initialized = true;
    }
  }

  private getCacheKey(endpoint: string, params: APIParams = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    return `${endpoint}?${sortedParams}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  private async makeRequest<T>(
    endpoint: string,
    params: APIParams = {},
  ): Promise<T> {
    this.initialize();

    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data as T;
    }

    try {
      // Ensure api_key is always included in the request
      const requestParams = {
        api_key: this.apiKey,
        ...params,
      };

      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params: requestParams,
      });

      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });

      return response.data;
    } catch {
      throw new Error("Failed to fetch data from TMDB API");
    }
  }

  async getPopularMovies(page: number = 1): Promise<SearchResponse> {
    try {
      const response = await fetch(`/api/movies/popular?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch popular movies");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getTopRatedMovies(page: number = 1): Promise<SearchResponse> {
    try {
      const response = await fetch(`/api/movies/top-rated?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch top rated movies");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getNowPlayingMovies(page: number = 1): Promise<SearchResponse> {
    try {
      const response = await fetch(`/api/movies/now-playing?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch now playing movies");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    try {
      const response = await fetch(
        `/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`,
      );
      if (!response.ok) {
        throw new Error("Failed to search movies");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    try {
      const response = await fetch(`/api/movies/${movieId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getMovieCredits(movieId: number): Promise<MovieCredits> {
    try {
      const response = await fetch(`/api/movies/${movieId}/credits`);
      if (!response.ok) {
        throw new Error("Failed to fetch movie credits");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getRecommendations(
    movieId: number,
    page: number = 1,
  ): Promise<SearchResponse> {
    try {
      const response = await fetch(
        `/api/movies/${movieId}/recommendations?page=${page}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movie recommendations");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getUpcomingMovies(page: number = 1): Promise<SearchResponse> {
    try {
      const response = await fetch(`/api/movies/upcoming?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch upcoming movies");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getTrendingMovies(page: number = 1): Promise<SearchResponse> {
    try {
      const response = await fetch(
        `/api/movies/trending?type=movies&page=${page}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trending movies");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getTrendingTVShows(page: number = 1): Promise<TVSearchResponse> {
    try {
      const response = await fetch(`/api/movies/trending?type=tv&page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch trending TV shows");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getTrendingAll(
    page: number = 1,
  ): Promise<SearchResponse | TVSearchResponse> {
    try {
      const response = await fetch(`/api/movies/trending-all?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch trending all content");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getTVShowDetails(tvShowId: number): Promise<TVShowDetails> {
    try {
      const response = await fetch(`/api/tv-shows/${tvShowId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch TV show details");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getTVShowCredits(tvShowId: number): Promise<MovieCredits> {
    try {
      const response = await fetch(`/api/tv-shows/${tvShowId}/credits`);
      if (!response.ok) {
        throw new Error("Failed to fetch TV show credits");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getTVShowRecommendations(
    tvShowId: number,
    page: number = 1,
  ): Promise<TVSearchResponse> {
    try {
      const response = await fetch(
        `/api/tv-shows/${tvShowId}/recommendations?page=${page}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch TV show recommendations");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getPopularTVShows(page: number = 1): Promise<TVSearchResponse> {
    try {
      const response = await fetch(`/api/tv-shows/popular?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch popular TV shows");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getTopRatedTVShows(page: number = 1): Promise<TVSearchResponse> {
    try {
      const response = await fetch(`/api/tv-shows/top-rated?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch top rated TV shows");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getOnAirTVShows(page: number = 1): Promise<TVSearchResponse> {
    try {
      const response = await fetch(`/api/tv-shows/on-air?page=${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch on air TV shows");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async searchTVShows(
    query: string,
    page: number = 1,
  ): Promise<TVSearchResponse> {
    try {
      const response = await fetch(
        `/api/tv-shows/search?query=${encodeURIComponent(query)}&page=${page}`,
      );
      if (!response.ok) {
        throw new Error("Failed to search TV shows");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async getGenres(): Promise<{ genres: Genre[] }> {
    try {
      const response = await fetch("/api/movies/genres");
      if (!response.ok) {
        throw new Error("Failed to fetch genres");
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  getImageURL(path: string, size: string = "w500"): string {
    this.initialize();
    if (!path) return "/placeholder-movie.jpg";
    return `${this.imageBaseURL}/${size}${path}`;
  }

  getBackdropURL(path: string, size: string = "w1280"): string {
    this.initialize();
    if (!path) return "/placeholder-backdrop.jpg";
    return `${this.imageBaseURL}/${size}${path}`;
  }

  getProfileURL(path: string, size: string = "w185"): string {
    this.initialize();
    if (!path) return "/placeholder-profile.jpg";
    return `${this.imageBaseURL}/${size}${path}`;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const movieService = new MovieService();
