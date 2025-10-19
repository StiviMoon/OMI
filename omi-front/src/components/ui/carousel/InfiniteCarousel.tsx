'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import Image from 'next/image';

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  duration?: number;
}

interface InfiniteCarouselProps {
  title: string;
  movies: Movie[];
  onLoadMore?: () => Promise<void>;
  hasMore?: boolean;
  scrollSpeed?: number; // píxeles por frame - default 1 (más alto = más rápido)
  autoplay?: boolean; // default true
  isPreview?: boolean; // Modo preview - oculta el ícono de play
}

export const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  title,
  movies,
  onLoadMore,
  hasMore = false,
  scrollSpeed = 1,
  autoplay = true,
  isPreview = false
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar más contenido
  const handleLoadMore = useCallback(async () => {
    if (!onLoadMore || isLoading) return;
    
    setIsLoading(true);
    try {
      await onLoadMore();
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onLoadMore, isLoading]);

  // Verificar posición del scroll
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );

    // Detectar si está cerca del final para cargar más
    const isNearEnd = 
      container.scrollLeft + container.clientWidth >= container.scrollWidth - 500;

    if (isNearEnd && hasMore && !isLoading && onLoadMore) {
      handleLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore, handleLoadMore]);

  // Scroll suave hacia la izquierda/derecha (para botones)
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  // Autoplay continuo y suave con requestAnimationFrame
  const startContinuousScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isPaused || !autoplay) return;

    const animate = () => {
      if (!container || isPaused || !autoplay) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        return;
      }

      const isAtEnd = 
        container.scrollLeft >= container.scrollWidth - container.clientWidth - 10;

      if (isAtEnd) {
        // Volver al inicio suavemente
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll continuo muy suave
        container.scrollLeft += scrollSpeed;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isPaused, autoplay, scrollSpeed]);

  // Detener autoplay
  const stopContinuousScroll = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Toggle pause/play
  const toggleAutoplay = () => {
    setIsPaused(!isPaused);
  };

  // Pausar temporalmente cuando el usuario interactúa
  const handleUserInteraction = () => {
    setIsPaused(true);
    
    // Limpiar timeout previo si existe
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    
    // Reanudar después de 5 segundos sin interacción
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  // Efectos
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollPosition();
    
    const handleScroll = () => {
      checkScrollPosition();
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [checkScrollPosition]);

  useEffect(() => {
    stopContinuousScroll();
    
    if (autoplay && !isPaused && movies.length > 0) {
      // Pequeño delay para evitar conflictos
      const timeout = setTimeout(() => {
        startContinuousScroll();
      }, 100);

      return () => {
        clearTimeout(timeout);
        stopContinuousScroll();
      };
    }

    return () => stopContinuousScroll();
  }, [autoplay, isPaused, movies.length, startContinuousScroll]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopContinuousScroll();
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative group mb-8">
      {/* Título y Control de Autoplay */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-12">
        <h2 className="text-2xl font-bold text-white">
          {title}
        </h2>
        
        {/* Botón de Pause/Play */}
        {autoplay && (
          <button
            onClick={toggleAutoplay}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50"
            aria-label={isPaused ? 'Play autoplay' : 'Pause autoplay'}
            title={isPaused ? 'Reanudar' : 'Pausar'}
          >
            {isPaused ? (
              <Play className="w-5 h-5 fill-current" />
            ) : (
              <Pause className="w-5 h-5 fill-current" />
            )}
          </button>
        )}
      </div>

      {/* Botón Izquierdo */}
      {canScrollLeft && (
        <button
          onClick={() => {
            scroll('left');
            handleUserInteraction();
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-white p-2 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Contenedor del carrusel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleUserInteraction}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'auto' // Importante para el scroll continuo
        }}
      >
        {movies.map((movie, index) => (
          <div
            key={`${movie.id}-${index}`}
            className={`
              flex-shrink-0 w-48 md:w-56 group/card transition-transform hover:scale-105
              ${isPreview ? 'cursor-default' : 'cursor-pointer'}
            `}
            onClick={handleUserInteraction}
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 192px, 224px"
              />
              
              {/* Overlay on hover - Oculta el ícono en modo preview */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                {!isPreview && (
                  <Play className="w-12 h-12 text-white" />
                )}
              </div>

              {/* Duration badge */}
              {movie.duration && (
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                  {Math.floor(movie.duration / 60)}:{String(Math.floor(movie.duration % 60)).padStart(2, '0')}
                </div>
              )}
            </div>

            {/* Título */}
            <h3 className="text-white text-sm font-medium mt-2 line-clamp-2">
              {movie.title}
            </h3>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex-shrink-0 w-48 md:w-56 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        )}

        {/* Placeholder para cargar más */}
        {hasMore && !isLoading && (
          <div className="flex-shrink-0 w-48 md:w-56 flex items-center justify-center text-gray-500">
            <p className="text-sm">Desliza para más →</p>
          </div>
        )}
      </div>

      {/* Botón Derecho */}
      {canScrollRight && (
        <button
          onClick={() => {
            scroll('right');
            handleUserInteraction();
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-white p-2 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-4"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};