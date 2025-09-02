"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Play,
  Clock,
  MapPin,
  Calendar,
  Users,
  Tag,
} from "lucide-react";
import {
  movieService,
  Movie,
  MovieDetails as MovieDetailsType,
  CastMember,
} from "@/services/MovieService";
import { cn } from "@/lib/utils";
import { Navigation } from "@/components/Navigation";

interface MovieDetailsProps {
  movieId: number;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movieId }) => {
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [videos, setVideos] = useState<{
    key: string;
    site: string;
    type: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLiked, setUserLiked] = useState<boolean | null>(null);
  const [userRating, setUserRating] = useState<number>(0);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const [movieData, recommendationsData, castData, videosData] =
          await Promise.all([
            movieService.getMovieDetails(movieId),
            movieService.getRecommendations(movieId, 1),
            movieService.getMovieCredits(movieId),
            fetchMovieVideos(movieId),
          ]);

        setMovie(movieData);

        // Filter recommendations to show movies with similar names
        const similarMovies = filterSimilarMovies(
          recommendationsData.results,
          movieData.title,
        );

        setRecommendations(similarMovies.slice(0, 6)); // Show 6 recommendations in 2 rows of 3

        setCast(castData.cast.slice(0, 10)); // Show top 10 cast members
        setVideos(videosData);
      } catch {
        setError("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  // Function to fetch movie videos/trailers
  const fetchMovieVideos = async (movieId: number) => {
    try {
      const response = await fetch(`/api/movies/${movieId}/videos`);
      if (!response.ok) {
        throw new Error("Failed to fetch movie videos");
      }
      const data = await response.json();

      // Filter for official trailers from YouTube
      const officialTrailer = data.results.filter(
        (trailer: { type: string; site: string }) =>
          trailer.type === "Trailer" && trailer.site === "YouTube",
      );

      // Return the first official trailer, or null if none found
      return officialTrailer.length > 0 ? officialTrailer[0] : null;
    } catch {
      return null;
    }
  };

  // Function to filter movies with similar names
  const filterSimilarMovies = (movies: Movie[], currentTitle: string) => {
    if (!currentTitle) return movies;

    const currentWords = currentTitle.toLowerCase().split(/\s+/);

    // First try to find movies with at least 2 matching words
    let similarMovies = movies.filter((movie) => {
      const movieWords = movie.title.toLowerCase().split(/\s+/);

      const commonWords = currentWords.filter((word) =>
        movieWords.some(
          (movieWord) => movieWord.includes(word) || word.includes(movieWord),
        ),
      );

      return commonWords.length >= 2;
    });

    // If no movies found with 2+ matches, try with 1+ match
    if (similarMovies.length === 0) {
      similarMovies = movies.filter((movie) => {
        const movieWords = movie.title.toLowerCase().split(/\s+/);

        const commonWords = currentWords.filter((word) =>
          movieWords.some(
            (movieWord) => movieWord.includes(word) || word.includes(movieWord),
          ),
        );

        return commonWords.length >= 1;
      });
    }

    // If still no movies found, return original list (fallback)
    if (similarMovies.length === 0) {
      return movies;
    }

    // Sort by similarity score
    return similarMovies.sort((a, b) => {
      const aWords = a.title.toLowerCase().split(/\s+/);
      const bWords = b.title.toLowerCase().split(/\s+/);

      const aScore = currentWords.filter((word) =>
        aWords.some(
          (movieWord) => movieWord.includes(word) || word.includes(movieWord),
        ),
      ).length;

      const bScore = currentWords.filter((word) =>
        bWords.some(
          (movieWord) => movieWord.includes(word) || word.includes(movieWord),
        ),
      ).length;

      return bScore - aScore; // Higher score first
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">{error || "Movie not found"}</div>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getQualityBadge = (voteAverage: number) => {
    return voteAverage >= 7.0 ? "HD" : "CAM";
  };

  const getQualityBadgeColor = (voteAverage: number) => {
    return voteAverage >= 7.0 ? "bg-green-500" : "bg-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-2">
        <div className="text-gray-400 text-sm">
          Home / Movies / {movie.title}
        </div>
      </div>

      {/* Trailer Section */}
      <div id="trailer-section" className="container mx-auto px-4 py-8">
        {videos ? (
          <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-800">
            <iframe
              src={`https://www.youtube.com/embed/${videos.key}`}
              title={`${movie.title} Trailer`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="w-full h-96 rounded-lg bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold mb-2">
                No Trailer Available
              </h3>
              <p className="text-sm">
                Trailer for this movie is not available at the moment.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Movie Poster */}
              <div className="relative w-64 h-96 flex-shrink-0">
                <Image
                  src={movieService.getImageURL(movie.poster_path, "w500")}
                  alt={movie.title}
                  fill
                  className="rounded-lg object-cover"
                />
                <div className="absolute inset-0  bg-opacity-5 rounded-lg flex items-center justify-center hover:bg-opacity-10 transition-all duration-200">
                  {videos ? (
                    <div
                      className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors cursor-pointer"
                      onClick={() => {
                        // Scroll to trailer section
                        const trailerSection =
                          document.getElementById("trailer-section");
                        if (trailerSection) {
                          trailerSection.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  )}
                </div>
              </div>

              {/* Movie Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-white">
                    {movie.title}
                  </h1>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-2">
                      Score: {userRating || 0} / 5 rated
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setUserLiked(true)}
                        className={cn(
                          "p-2 rounded",
                          userLiked === true
                            ? "bg-green-500"
                            : "bg-gray-700 hover:bg-gray-600",
                        )}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setUserLiked(false)}
                        className={cn(
                          "p-2 rounded",
                          userLiked === false
                            ? "bg-red-500"
                            : "bg-gray-700 hover:bg-gray-600",
                        )}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Rating Stars */}
                    <div className="flex items-center space-x-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setUserRating(star)}
                          className={cn(
                            "text-lg transition-colors",
                            star <= userRating
                              ? "text-yellow-400"
                              : "text-gray-400 hover:text-yellow-300",
                          )}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metadata Bar */}
                <div className="flex items-center space-x-4 mb-4">
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs font-bold",
                      getQualityBadgeColor(movie.vote_average),
                    )}
                  >
                    {getQualityBadge(movie.vote_average)}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(movie.runtime)}</span>
                  </div>
                </div>

                {/* Synopsis */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {movie.overview}
                </p>

                {/* Detailed Information */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Country:</span>
                    <span>
                      {movie.production_companies[0]?.name || "United States"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Genre:</span>
                    <span>{movie.genres.map((g) => g.name).join(", ")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Released:</span>
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Production:</span>
                    <span>
                      {movie.production_companies.map((c) => c.name).join(", ")}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      `Watch ${movie.title} Online Free`,
                      `${movie.title} Online Free`,
                      `Where to watch ${movie.title}`,
                      `${movie.title} movie free online`,
                      `${movie.title} free online`,
                    ].map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-700 rounded-full text-xs hover:bg-gray-600 cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cast Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Cast</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {cast.map((member) => (
                      <div
                        key={member.id}
                        className="bg-gray-800 rounded-lg p-3 text-center"
                      >
                        <div className="relative w-16 h-16 mx-auto mb-2">
                          <Image
                            src={movieService.getProfileURL(
                              member.profile_path || "",
                            )}
                            alt={member.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <h4 className="font-semibold text-sm mb-1">
                          {member.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {member.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - You May Also Like */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">You May Also Like</h3>

            {/* Debug Info */}
            <div className="text-xs text-gray-400 mb-2">
              Found {recommendations.length} recommendations
            </div>

            {recommendations.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className="relative">
                      <Image
                        src={movieService.getImageURL(rec.poster_path, "w200")}
                        alt={rec.title}
                        width={200}
                        height={300}
                        className="w-full h-32 object-cover"
                      />
                      <span
                        className={cn(
                          "absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold",
                          getQualityBadgeColor(rec.vote_average),
                        )}
                      >
                        {getQualityBadge(rec.vote_average)}
                      </span>
                    </div>
                    <div className="p-2">
                      <h4 className="font-semibold text-xs mb-1 line-clamp-2">
                        {rec.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="text-xs">
                          {new Date(rec.release_date).getFullYear()}
                        </span>
                        <span className="px-1 py-0.5 bg-gray-700 rounded text-xs">
                          Movie
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">🎬</div>
                <p className="text-sm">No similar movies found</p>
                <p className="text-xs mt-1">
                  Try viewing upcoming movies or now showing movies
                </p>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/upcoming"
                    className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    View Upcoming Movies
                  </Link>
                  <Link
                    href="/movies"
                    className="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors ml-2"
                  >
                    View Now Showing
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
