'use client'

import React from 'react'

import { cn } from '@/lib/utils'

interface LoaderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'skeleton'
}

export const Loader: React.FC<LoaderProps> = ({ 
  className, 
  size = 'md', 
  variant = 'spinner' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'bg-teal-500 rounded-full animate-pulse',
              size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="h-4 bg-gray-700 rounded animate-pulse" />
        <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'border-2 border-gray-700 border-t-teal-500 rounded-full animate-spin',
        sizeClasses[size],
        className
      )}
    />
  )
}

interface SkeletonProps {
  className?: string
  count?: number
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn('h-4 bg-gray-700 rounded animate-pulse', className)}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )
}

interface MovieCardSkeletonProps {
  className?: string
}

export const MovieCardSkeleton: React.FC<MovieCardSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('bg-gray-800 rounded-lg overflow-hidden', className)}>
      <div className="aspect-[2/3] bg-gray-700 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-700 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  )
}

interface MovieGridSkeletonProps {
  count?: number
  className?: string
}

export const MovieGridSkeleton: React.FC<MovieGridSkeletonProps> = ({ 
  count = 12, 
  className 
}) => {
     return (
     <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4', className)}>
       {Array.from({ length: count }).map((_, i) => (
         <MovieCardSkeleton key={i} />
       ))}
     </div>
   )
}

interface PageLoaderProps {
  message?: string
}

export const PageLoader: React.FC<PageLoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader size="lg" variant="dots" className="mb-4" />
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>
  )
}
