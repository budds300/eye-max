import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MovieList } from "../components/MovieList";
import { useMovieStore } from "../store/movieStore";
import { movieService } from "../services/MovieService";

// Mock the movie service
jest.mock("../services/MovieService", () => ({
  movieService: {
    getPopularMovies: jest.fn(),
    getTopRatedMovies: jest.fn(),
    getNowPlayingMovies: jest.fn(),
    searchMovies: jest.fn(),
    getImageURL: jest.fn(() => "/test-image.jpg"),
    getBackdropURL: jest.fn(() => "/test-backdrop.jpg"),
    getProfileURL: jest.fn(() => "/test-profile.jpg"),
  },
}));

// Mock the store
jest.mock("../store/movieStore", () => ({
  useMovieStore: jest.fn(),
}));

const mockMovie = {
  id: 1,
  title: "Test Movie",
  overview: "This is a test movie overview",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  release_date: "2023-01-01",
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [1, 2],
  popularity: 100,
};

const mockSearchResponse = {
  page: 1,
  results: [mockMovie],
  total_pages: 1,
  total_results: 1,
};

describe("MovieList", () => {
  const mockStore = {
    movies: [],
    searchResults: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
    searchLoading: false,
    searchError: null,
    setMovies: jest.fn(),
    setSearchResults: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    setSearchLoading: jest.fn(),
    setSearchError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMovieStore as jest.Mock).mockReturnValue(mockStore);
  });

  it("renders loading state when loading", () => {
    // Mock the store to return loading state
    (useMovieStore as jest.Mock).mockReturnValue({
      ...mockStore,
      loading: true,
      movies: [],
      error: null,
    });
    render(<MovieList category="popular" />);

    expect(screen.getByText("Loading movies...")).toBeInTheDocument();
  });

  it("renders error state when there is an error", () => {
    mockStore.error = "Failed to fetch movies";
    mockStore.loading = false;
    mockStore.movies = [];
    render(<MovieList category="popular" />);

    expect(screen.getByText("Error loading movies")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch movies")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("renders empty state when no movies", () => {
    mockStore.loading = false;
    mockStore.error = null;
    mockStore.movies = [];
    render(<MovieList category="popular" />);

    expect(screen.getByText("No movies found")).toBeInTheDocument();
    expect(screen.getByText("Please try again later")).toBeInTheDocument();
  });

  it("renders movies when available", () => {
    mockStore.movies = [mockMovie];
    render(<MovieList category="popular" />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test movie overview"),
    ).toBeInTheDocument();
  });

  it("renders search results when in search mode", () => {
    mockStore.searchResults = [mockMovie];
    render(<MovieList category="search" searchQuery="test" />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
  });

  it("shows load more button when there are more pages", () => {
    mockStore.movies = [mockMovie];
    mockStore.totalPages = 2;
    render(<MovieList category="popular" />);

    expect(screen.getByText("Load More")).toBeInTheDocument();
  });

  it("handles load more click", async () => {
    mockStore.movies = [mockMovie];
    mockStore.totalPages = 2;
    (movieService.getPopularMovies as jest.Mock).mockResolvedValue(
      mockSearchResponse,
    );

    render(<MovieList category="popular" />);

    const loadMoreButton = screen.getByText("Load More");
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(movieService.getPopularMovies).toHaveBeenCalledWith(2);
    });
  });

  it("shows movie count information", () => {
    mockStore.movies = [mockMovie];
    mockStore.totalPages = 1;
    render(<MovieList category="popular" />);

    expect(screen.getByText("Showing 1 of 20 movies")).toBeInTheDocument();
  });
});
