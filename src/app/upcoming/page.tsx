"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { PageLoader } from "@/components/ui/loader";
import { movieService, Movie } from "@/services/MovieService";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";

export default function UpcomingMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        setLoading(true);
        const response = await movieService.getUpcomingMovies(currentPage);
        setMovies(response.results);
        setTotalPages(response.total_pages);
      } catch {
        setError("Failed to load upcoming movies");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, [currentPage]);

  const getQualityBadge = (voteAverage: number) => {
    return voteAverage >= 7.0 ? "HD" : "CAM";
  };

  const getQualityBadgeColor = (voteAverage: number) => {
    return voteAverage >= 7.0 ? "bg-green-500" : "bg-gray-800";
  };

  if (loading) {
    return <PageLoader message="Loading upcoming movies..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-white text-xl mb-2">Error</div>
          <div className="text-gray-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-2">
        <div className="text-gray-400 text-sm">Home / Movies / Upcoming</div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Upcoming Movies</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">View more</span>
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <Link href={`/movie/${movie.id}`}>
                <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                  {/* Movie Poster */}
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={movieService.getImageURL(movie.poster_path, "w300")}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Quality Badge */}
                    <div
                      className={cn(
                        "absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold",
                        getQualityBadgeColor(movie.vote_average),
                      )}
                    >
                      {getQualityBadge(movie.vote_average)}
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-teal-400 transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                      <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                        Movie
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                Previous
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      className={cn(
                        currentPage === page
                          ? "bg-teal-500 hover:bg-teal-600"
                          : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700",
                      )}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
