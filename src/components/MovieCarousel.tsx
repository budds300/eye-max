"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@/services/MovieService";
import { movieService } from "@/services/MovieService";
import { cn } from "@/lib/utils";

interface MovieCarouselProps {
  movies: Movie[];
  className?: string;
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  movies,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(
      (prev) => (prev + newDirection + movies.length) % movies.length,
    );
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  if (!movies.length) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div className={cn("relative h-full overflow-hidden", className)}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        >
          <div className="absolute inset-0">
            {/* Background Image */}
            <Image
              src={movieService.getBackdropURL(currentMovie.backdrop_path)}
              alt={currentMovie.title}
              fill
              className="object-cover"
              priority
            />

            {/* Overlay with diagonal lines pattern and fade-out at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                   45deg,
                   transparent,
                   transparent 10px,
                   rgba(255, 255, 255, 0.1) 10px,
                   rgba(255, 255, 255, 0.1) 20px
                 )`,
                  }}
                ></div>
              </div>
              {/* Additional fade-out gradient at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/100 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl">
                  {/* Movie Title */}
                  <h1 className="text-5xl font-bold mb-6 text-white">
                    {currentMovie.title}
                  </h1>

                  {/* Metadata Bar */}
                  <div className="flex items-center space-x-6 mb-6">
                    <span className="px-3 py-1 rounded text-sm font-bold bg-teal-500">
                      HD
                    </span>
                    <div className="flex items-center space-x-2 text-white">
                      <Clock className="w-4 h-4" />
                      <span>Duration: 156min</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>
                        IMDB: {formatRating(currentMovie.vote_average)}
                      </span>
                    </div>
                    <div className="text-white">
                      <span>Genre: Action, Drama</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-xl">
                    {currentMovie.overview.length > 200
                      ? `${currentMovie.overview.substring(0, 200)}...`
                      : currentMovie.overview}
                  </p>

                  {/* Watch Now Button */}
                  <Link href={`/movie/${currentMovie.id}`}>
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg text-lg font-semibold flex items-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>Watch now</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-teal-500/20 border border-teal-500/30"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-teal-500/20 border border-teal-500/30"
        onClick={() => paginate(1)}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {movies.slice(0, 5).map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-3 w-3 rounded-full transition-all",
              index === currentIndex
                ? "bg-teal-500"
                : "bg-white/30 hover:bg-white/50",
            )}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </div>
  );
};
