"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/MovieCard";
import { movieService, Movie } from "@/services/MovieService";

export const ComingSoonSection: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      setLoading(true);
      try {
        const response = await movieService.getUpcomingMovies();
        setMovies(response.results);
      } catch {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, []);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          View more
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading upcoming movies...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {movies.slice(0, 18).map((movie) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
