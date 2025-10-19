'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from '../movie/MovieCard';

/**
 * Represents the structure of a movie/video displayed in the section.
 * 
 * @interface Movie
 */
interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  videoUrl: string;
  duration?: number;
  tags?: string[];
  user?: {
    name: string;
    url: string;
  };
  width?: number;
  height?: number;
  year?: number;
  rating?: number;
}

/**
 * Props for the {@link ContentSection} component.
 * 
 * @interface ContentSectionProps
 */
interface ContentSectionProps {
  /** Section title displayed at the top. */
  title: string;
  /** List of movies or videos to render in the carousel. */
  movies: Movie[];
  /** Optional callback triggered when a movie is added or removed from the list. */
  onAddToList?: (id: string) => void;
}

/**
 * Horizontal scrollable content section for displaying videos or movies.
 * 
 * This component features:
 * - Responsive horizontal scrolling with chevron navigation
 * - Favorite management via `localStorage`
 * - Smooth scroll behavior depending on screen width
 * - Dynamic visibility of navigation buttons based on scroll position
 * 
 * @component
 * @example
 * <ContentSection
 *   title="Popular Videos"
 *   movies={movies}
 *   onAddToList={(id) => console.log("Added to list:", id)}
 * />
 * 
 * @param {ContentSectionProps} props - The component props.
 * @returns {JSX.Element} A horizontally scrollable video section.
 */
export const ContentSection: React.FC<ContentSectionProps> = ({ 
  title, 
  movies, 
  onAddToList 
}) => {
  // ======= REFS & STATE =======
  const scrollRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // ======= LOAD FAVORITES =======
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  /**
   * Checks whether the user can scroll left or right.
   * Updates chevron visibility accordingly.
   */
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Add scroll listener
  useEffect(() => {
    checkScroll();
    const scrollElement = scrollRef.current;
    
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      return () => scrollElement.removeEventListener('scroll', checkScroll);
    }
  }, [movies]);

  /**
   * Calculates scroll distance dynamically based on current screen size.
   * 
   * @returns {number} The amount of pixels to scroll horizontally.
   */
  const getScrollAmount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 300;
      if (window.innerWidth < 1024) return 500;
      return 800;
    }
    return 800;
  };

  /**
   * Handles horizontal scrolling behavior.
   * Loops around when the user reaches either end of the carousel.
   * 
   * @param {'left' | 'right'} direction - Scroll direction.
   */
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollAmount = getScrollAmount();

      if (direction === 'right') {
        // Loop to start if end is reached
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        // Loop to end if at start
        if (scrollLeft <= 10) {
          scrollRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  /**
   * Adds or removes a movie from the favorites list.
   * Updates `localStorage` and triggers the optional external callback.
   * 
   * @param {string} videoId - The ID of the movie to toggle.
   */
  const handleAddToList = (videoId: string) => {
    setFavorites(prev => {
      let newFavorites;
      
      if (prev.includes(videoId)) {
        newFavorites = prev.filter(id => id !== videoId);
      } else {
        newFavorites = [...prev, videoId];
      }
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      onAddToList?.(videoId);
      
      return newFavorites;
    });
  };

  // ======= RENDER =======
  return (
    <section className="py-8 relative w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 px-4 sm:px-8 lg:px-16">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>
      
      <div className="relative px-4 sm:px-8 lg:px-16 group">
        {/* Left Chevron Button */}
        {canScrollLeft && (
          <div className="hidden md:flex absolute left-4 sm:left-8 lg:left-16 top-0 bottom-0 z-10 items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <Button
              variant="ghost"
              size="icon"
              className="pointer-events-auto bg-black/80 hover:bg-black/90 rounded-md"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-10 w-10" />
            </Button>
          </div>
        )}

        {/* Scrollable Movie Container */}
        <div 
          ref={scrollRef} 
          className="flex gap-4 overflow-x-scroll pb-4 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0">
              <MovieCard
                id={movie.id}
                title={movie.title}
                posterUrl={movie.posterUrl}
                videoUrl={movie.videoUrl}
                duration={movie.duration}
                tags={movie.tags}
                user={movie.user}
                width={movie.width}
                height={movie.height}
                year={movie.year}
                onAddToList={handleAddToList}
                isInList={favorites.includes(movie.id)}
              />
            </div>
          ))}
        </div>

        {/* Right Chevron Button */}
        {canScrollRight && (
          <div className="hidden md:flex absolute right-4 sm:right-8 lg:right-16 top-0 bottom-0 z-10 items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <Button
              variant="ghost"
              size="icon"
              className="pointer-events-auto bg-black/80 hover:bg-black/90 rounded-md"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-10 w-10" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
