"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMovieStore } from "@/store/movieStore";
import { movieService } from "@/services/MovieService";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search movies...",
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    setSearchResults,
    setSearchLoading,
    setSearchError,
    clearSearch,
  } = useMovieStore();

  // Debounced search function
  const debouncedSearch = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        clearSearch();
        return;
      }

      setIsSearching(true);
      setSearchLoading(true);
      setSearchError(null);

      try {
        const results = await movieService.searchMovies(searchTerm);
        setSearchResults(results);
        setSearchQuery(searchTerm);
        onSearch?.(searchTerm);
      } catch (error) {
        setSearchError(
          error instanceof Error ? error.message : "Search failed",
        );
      } finally {
        setIsSearching(false);
        setSearchLoading(false);
      }
    },
    [
      setSearchResults,
      setSearchLoading,
      setSearchError,
      setSearchQuery,
      clearSearch,
      onSearch,
    ],
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debounce(debouncedSearch, 500)(value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setQuery("");
    clearSearch();
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      debouncedSearch(query);
    }
  };

  // Initialize query from store
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-10"
          disabled={isSearching}
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
            onClick={handleClearSearch}
            disabled={isSearching}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
