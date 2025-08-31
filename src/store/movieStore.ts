
import { create } from 'zustand'
import { Movie, MovieDetails, SearchResponse } from '@/services/MovieService'

interface MovieState {
  // Movie list state
  movies: Movie[]
  currentPage: number
  totalPages: number
  totalResults: number
  loading: boolean
  error: string | null

  // Search state
  searchQuery: string
  searchResults: Movie[]
  searchLoading: boolean
  searchError: string | null

  // Selected movie state
  selectedMovie: MovieDetails | null
  selectedMovieLoading: boolean
  selectedMovieError: string | null

  // Recommendations state
  recommendations: Movie[]
  recommendationsLoading: boolean
  recommendationsError: string | null

  // Actions
  setMovies: (data: SearchResponse) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  setSearchQuery: (query: string) => void
  setSearchResults: (data: SearchResponse) => void
  setSearchLoading: (loading: boolean) => void
  setSearchError: (error: string | null) => void
  
  setSelectedMovie: (movie: MovieDetails | null) => void
  setSelectedMovieLoading: (loading: boolean) => void
  setSelectedMovieError: (error: string | null) => void
  
  setRecommendations: (movies: Movie[]) => void
  setRecommendationsLoading: (loading: boolean) => void
  setRecommendationsError: (error: string | null) => void
  
  clearSearch: () => void
  clearSelectedMovie: () => void
  clearRecommendations: () => void
  reset: () => void
}

export const useMovieStore = create<MovieState>((set) => ({
  // Initial state
  movies: [],
  currentPage: 1,
  totalPages: 0,
  totalResults: 0,
  loading: false,
  error: null,

  searchQuery: '',
  searchResults: [],
  searchLoading: false,
  searchError: null,

  selectedMovie: null,
  selectedMovieLoading: false,
  selectedMovieError: null,

  recommendations: [],
  recommendationsLoading: false,
  recommendationsError: null,

  // Actions
  setMovies: (data: SearchResponse) =>
    set({
      movies: data.results,
      currentPage: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      loading: false,
      error: null,
    }),

  setLoading: (loading: boolean) =>
    set({ loading }),

  setError: (error: string | null) =>
    set({ error, loading: false }),

  setSearchQuery: (query: string) =>
    set({ searchQuery: query }),

  setSearchResults: (data: SearchResponse) =>
    set({
      searchResults: data.results,
      searchLoading: false,
      searchError: null,
    }),

  setSearchLoading: (loading: boolean) =>
    set({ searchLoading: loading }),

  setSearchError: (error: string | null) =>
    set({ searchError: error, searchLoading: false }),

  setSelectedMovie: (movie: MovieDetails | null) =>
    set({
      selectedMovie: movie,
      selectedMovieLoading: false,
      selectedMovieError: null,
    }),

  setSelectedMovieLoading: (loading: boolean) =>
    set({ selectedMovieLoading: loading }),

  setSelectedMovieError: (error: string | null) =>
    set({ selectedMovieError: error, selectedMovieLoading: false }),

  setRecommendations: (movies: Movie[]) =>
    set({
      recommendations: movies,
      recommendationsLoading: false,
      recommendationsError: null,
    }),

  setRecommendationsLoading: (loading: boolean) =>
    set({ recommendationsLoading: loading }),

  setRecommendationsError: (error: string | null) =>
    set({ recommendationsError: error, recommendationsLoading: false }),

  clearSearch: () =>
    set({
      searchQuery: '',
      searchResults: [],
      searchLoading: false,
      searchError: null,
    }),

  clearSelectedMovie: () =>
    set({
      selectedMovie: null,
      selectedMovieLoading: false,
      selectedMovieError: null,
    }),

  clearRecommendations: () =>
    set({
      recommendations: [],
      recommendationsLoading: false,
      recommendationsError: null,
    }),

  reset: () =>
    set({
      movies: [],
      currentPage: 1,
      totalPages: 0,
      totalResults: 0,
      loading: false,
      error: null,
      searchQuery: '',
      searchResults: [],
      searchLoading: false,
      searchError: null,
      selectedMovie: null,
      selectedMovieLoading: false,
      selectedMovieError: null,
      recommendations: [],
      recommendationsLoading: false,
      recommendationsError: null,
    }),
}))

