'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, X, Loader2, Film, SlidersHorizontal } from 'lucide-react';
import { videosAPI } from '@/lib/api/videos';
import { Movie } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoSelect?: (movie: Movie) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onVideoSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtros
  const [orientation, setOrientation] = useState<'landscape' | 'portrait' | 'square' | ''>('');
  const [size, setSize] = useState<'large' | 'medium' | 'small' | ''>('');
  const [minDuration, setMinDuration] = useState<string>('');
  const [maxDuration, setMaxDuration] = useState<string>('');

  // Debounce search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setMovies([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, orientation, size, minDuration, maxDuration]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const params: Partial<{
        query: string;
        per_page: number;
        orientation: 'landscape' | 'portrait' | 'square';
        size: 'large' | 'medium' | 'small';
        min_duration: number;
        max_duration: number;
      }> = {
        query: searchQuery,
        per_page: 15,
      };

      if (orientation) params.orientation = orientation as 'landscape' | 'portrait' | 'square';
      if (size) params.size = size as 'large' | 'medium' | 'small';
      if (minDuration) params.min_duration = parseInt(minDuration);
      if (maxDuration) params.max_duration = parseInt(maxDuration);

      const results = await videosAPI.search(params as import('@/lib/types').SearchParams);
      setMovies(results);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Error al buscar videos');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    onClose(); // Cierra el modal de búsqueda
    // Si hay un callback, llama al padre para que maneje la apertura del video
    if (onVideoSelect) {
      setTimeout(() => {
        onVideoSelect(movie);
      }, 150);
    }
  };

  const clearFilters = () => {
    setOrientation('');
    setSize('');
    setMinDuration('');
    setMaxDuration('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl mx-4 bg-gray-900 rounded-lg shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Buscar Videos</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
              title="Filtros"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar películas, series, anime..."
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-6 pb-4 space-y-4 border-b border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Orientation */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Orientación
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as 'landscape' | 'portrait' | 'square' | '')}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Todas</option>
                  <option value="landscape">Horizontal</option>
                  <option value="portrait">Vertical</option>
                  <option value="square">Cuadrado</option>
                </select>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tamaño
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as 'large' | 'medium' | 'small' | '')}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="large">Grande</option>
                  <option value="medium">Mediano</option>
                  <option value="small">Pequeño</option>
                </select>
              </div>

              {/* Min Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duración mínima (segundos)
                </label>
                <input
                  type="number"
                  value={minDuration}
                  onChange={(e) => setMinDuration(e.target.value)}
                  placeholder="Ej: 10"
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Max Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duración máxima (segundos)
                </label>
                <input
                  type="number"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                  placeholder="Ej: 60"
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Results Area */}
        <div className="p-6 pt-4 max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-8">
              <p>{error}</p>
            </div>
          ) : searchQuery && movies.length > 0 ? (
            <div className="space-y-3">
              <div className="text-gray-400 text-sm mb-4">
                {movies.length} resultados para &quot;{searchQuery}&quot;
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {movies.map((movie) => (
                  <div 
                    key={movie.id}
                    onClick={() => handleMovieClick(movie)}
                    className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer transition-all group hover:scale-[1.02]"
                  >
                    <div className="relative w-24 h-16 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                      {movie.posterUrl ? (
                        <Image 
                          src={movie.posterUrl} 
                          alt={movie.title}
                          fill
                          sizes="96px"
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                      {movie.duration && movie.duration > 0 && (
                        <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs text-white">
                          {Math.floor(movie.duration / 60)}:{String(Math.floor(movie.duration % 60)).padStart(2, '0')}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm truncate mb-1">
                        {movie.title}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {movie.width}x{movie.height} • {movie.user?.name || 'Desconocido'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchQuery && movies.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No se encontraron resultados para &quot;{searchQuery}&quot;</p>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Escribe para buscar contenido</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};