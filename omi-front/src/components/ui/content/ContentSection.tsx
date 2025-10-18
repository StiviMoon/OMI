'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/ui/movie/MovieCard';

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

interface ContentSectionProps {
  title: string;
  movies: Movie[];
  onAddToList?: (id: string) => void;
  isPreview?: boolean;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ 
  title, 
  movies, 
  onAddToList,
  isPreview = false 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Cargar favoritos del localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Verificar si se puede hacer scroll
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollElement = scrollRef.current;
    
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      return () => scrollElement.removeEventListener('scroll', checkScroll);
    }
  }, [movies]);

  // Obtener scroll amount dinámico basado en el ancho de pantalla
  const getScrollAmount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 300;
      if (window.innerWidth < 1024) return 500;
      return 800;
    }
    return 800;
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollAmount = getScrollAmount();

      if (direction === 'right') {
        // Si llegamos al final, volver al inicio
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        // Si estamos al inicio, ir al final
        if (scrollLeft <= 10) {
          scrollRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

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

  return (
    <section className="py-6 sm:py-8 relative w-full">
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-8 lg:px-16">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">{title}</h2>
      </div>
      
      <div className="relative px-4 sm:px-8 lg:px-16 group">
        {/* Chevron Izquierdo */}
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

        {/* Contenedor de scroll */}
        <div 
          ref={scrollRef} 
          className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-scroll pb-4 scroll-smooth"
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
                isPreview={isPreview}
              />
            </div>
          ))}
        </div>

        {/* Chevron Derecho */}
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