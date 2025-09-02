"use client";

import React, { useState, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { MovieList } from "@/components/MovieList";
import { MovieCarousel } from "@/components/MovieCarousel";
import { TrendingSection } from "@/components/TrendingSection";
import { Button } from "@/components/ui/button";
import { useMovieStore } from "@/store/movieStore";
import { movieService, Movie } from "@/services/MovieService";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/ui/loader";
import { LatestTVShows } from "@/components/LatestTVShows";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { loading } = useAuth();
  const [activeCategory, setActiveCategory] = useState<
    "popular" | "top-rated" | "now-playing"
  >("popular");
  const { searchQuery } = useMovieStore();
  const [carouselMovies, setCarouselMovies] = useState<Movie[]>([]);

  // Fetch movies for carousel
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await movieService.getTrendingMovies();
        setCarouselMovies(response.results.slice(0, 5));
      } catch {
        // Handle error silently
      }
    };

    fetchMovies();
  }, []);

  const categories = [
    { id: "popular", label: "Popular" },
    { id: "top-rated", label: "Top Rated" },
    { id: "now-playing", label: "Now Playing" },
  ] as const;

  if (loading) {
    return <PageLoader message="Loading application..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />

      {/* Hero Carousel Section */}
      {!searchQuery && carouselMovies.length > 0 && (
        <section className="relative h-[80vh]">
          <MovieCarousel movies={carouselMovies} />
        </section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Trending Section */}
        {!searchQuery && (
          <section className="mb-12">
            <TrendingSection />
          </section>
        )}

        {/* Search Section */}
        <section className="mb-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-white">
              Discover Amazing Movies
            </h2>
            <p className="mb-6 text-center text-gray-400">
              Search for your favorite movies or explore our curated collections
            </p>
            <SearchBar className="w-full" />
          </div>
        </section>

        {/* Categories */}
        {!searchQuery && (
          <section className="mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    activeCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "transition-all duration-200",
                    activeCategory === category.id
                      ? "bg-teal-500 hover:bg-teal-600"
                      : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
                  )}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Movie List */}
        <section>
          {searchQuery ? (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-white">
                Search Results for &quot;{searchQuery}&quot;
              </h2>
              <MovieList category="search" searchQuery={searchQuery} />
            </div>
          ) : (
            <div>
              <h2 className="mb-6 text-2xl font-semibold text-white">
                {categories.find((c) => c.id === activeCategory)?.label} Movies
              </h2>
              <MovieList category={activeCategory} />
            </div>
          )}
        </section>

        {/* Latest TV Shows Section */}
        {!searchQuery && <LatestTVShows />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
