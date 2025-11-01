'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Heart, Play, Trash2, Grid3x3, List, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/ui/sidebar/sidebar';
import { VideoModal } from '@/components/ui/movie/VideoModal';
import { getAllFavorites, removeFromFavorites, type FavoriteVideo } from '@/lib/favorites';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteVideo[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<FavoriteVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      loadFavorites();
    }
  }, [isModalOpen]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading favorites...');
      const loadedFavorites = await getAllFavorites();
      console.log('✅ Loaded favorites:', loadedFavorites.length);
      console.log('📋 Favorites data:', loadedFavorites);
      setFavorites(loadedFavorites);
    } catch (error) {
      console.error('❌ Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    const success = await removeFromFavorites(id);
    if (success) {
      setFavorites(prev => prev.filter(fav => fav.id !== id));
    }
  };

  const clearAllFavorites = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar todos los favoritos?')) return;
    
    try {
      const deletePromises = favorites.map(fav => removeFromFavorites(fav.id));
      await Promise.all(deletePromises);
      setFavorites([]);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  const handlePlayVideo = (video: FavoriteVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedVideo(null);
    }, 300);
  };

  const allTags = Array.from(
    new Set(favorites.flatMap(fav => fav.tags || []))
  );

  const filteredFavorites = useMemo(() => {
    return favorites.filter(fav => {
      const matchesSearch = fav.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = filterTag === 'all' || (fav.tags && fav.tags.includes(filterTag));
      return matchesSearch && matchesTag;
    });
  }, [favorites, searchTerm, filterTag]);

  const totalPages = Math.ceil(filteredFavorites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFavorites = filteredFavorites.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTag]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden ml-0 md:ml-[60px] lg:ml-[120px] w-full md:w-[calc(100vw-60px)] lg:w-[calc(100vw-120px)] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Cargando favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Sidebar />
      
      <main className="flex-1 overflow-x-hidden ml-0 md:ml-[60px] lg:ml-[120px] w-full md:w-[calc(100vw-60px)] lg:w-[calc(100vw-120px)] transition-all duration-300">
        {/* Header moderno y sticky */}
        <div className="sticky top-0 z-20 bg-gradient-to-b from-black via-black/95 to-transparent backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full" />
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                    Mis Favoritos
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base mt-1">
                    {favorites.length} {favorites.length === 1 ? 'video guardado' : 'videos guardados'}
                  </p>
                </div>
              </div>

              {favorites.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAllFavorites}
                  className="
                    border-red-500/40 bg-transparent hover:bg-red-500/10
                    text-red-400 hover:text-red-300
                    hover:border-red-500/60
                    text-sm font-medium
                    px-4 py-2
                    transition-all duration-200
                    cursor-pointer
                    hover:scale-105 active:scale-95
                  "
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar todo
                </Button>
              )}
            </div>

            {favorites.length > 0 && (
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar en favoritos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="
                      w-full pl-12 pr-4 py-3
                      bg-white/5 border border-white/10 rounded-lg
                      text-white placeholder-gray-500
                      focus:outline-none focus:border-cyan-500/50 focus:bg-white/10
                      transition-all duration-200
                      text-sm sm:text-base
                    "
                  />
                </div>

                <div className="flex gap-3">
                  {allTags.length > 0 && (
                    <div className="relative flex-1 lg:flex-none lg:w-48">
                      <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                      <select
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                        className="
                          w-full pl-12 pr-4 py-3
                          bg-white/5 border border-white/10 rounded-lg
                          text-white
                          focus:outline-none focus:border-cyan-500/50 focus:bg-white/10
                          transition-all duration-200
                          appearance-none cursor-pointer
                          text-sm sm:text-base
                        "
                      >
                        <option value="all">Todos los tags</option>
                        {allTags.map(tag => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      className={`
                        h-10 w-10 transition-all duration-200 cursor-pointer
                        ${viewMode === 'grid' 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                        }
                      `}
                    >
                      <Grid3x3 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode('list')}
                      className={`
                        h-10 w-10 transition-all duration-200 cursor-pointer
                        ${viewMode === 'list' 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                        }
                      `}
                    >
                      <List className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {favorites.length === 0 ? (
            <div className="text-center py-20 sm:py-32">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 mb-6">
                <Heart className="h-12 w-12 text-gray-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">No tienes favoritos aún</h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">
                Empieza a agregar videos a tu lista de favoritos para verlos aquí
              </p>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="text-center py-20 sm:py-32">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 mb-6">
                <Search className="h-12 w-12 text-gray-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">No se encontraron resultados</h2>
              <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">
                Intenta con otros términos de búsqueda o cambia el filtro
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
                <p className="text-gray-400 text-sm">
                  Mostrando <span className="text-white font-medium">{startIndex + 1}-{Math.min(endIndex, filteredFavorites.length)}</span> de{' '}
                  <span className="text-white font-medium">{filteredFavorites.length}</span> favoritos
                </p>
                {totalPages > 1 && (
                  <p className="text-gray-400 text-sm">
                    Página <span className="text-white font-medium">{currentPage}</span> de{' '}
                    <span className="text-white font-medium">{totalPages}</span>
                  </p>
                )}
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                  {currentFavorites.map((video) => (
                    <div
                      key={video.id}
                      className="group relative rounded-lg overflow-hidden bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-300 cursor-pointer"
                      onClick={() => handlePlayVideo(video)}
                    >
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <Image
                          src={video.posterUrl}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          quality={90}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Overlay con botones en hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            size="icon"
                            className="bg-white text-black hover:bg-white/90 rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-2xl transition-all hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayVideo(video);
                            }}
                          >
                            <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-black" />
                          </Button>
                        </div>

                        {video.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium">
                            {formatTime(video.duration)}
                          </span>
                        )}

                        {/* Botón eliminar en hover */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFavorite(video.id, e);
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 hover:bg-red-600 text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="p-3 sm:p-4">
                        <h3 className="text-white text-xs sm:text-sm font-semibold mb-1 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                          {video.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400 mb-2">
                          <span>{formatDate(video.addedAt)}</span>
                          {video.width && video.height && (
                            <>
                              <span>•</span>
                              <span>{video.width}×{video.height}</span>
                            </>
                          )}
                        </div>

                        {video.tags && video.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {video.tags.slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full text-[10px] sm:text-xs truncate max-w-[80px] sm:max-w-none"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {currentFavorites.map((video) => (
                    <div
                      key={video.id}
                      className="group bg-zinc-900/50 hover:bg-zinc-800/50 rounded-lg overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                        <div 
                          className="relative w-full sm:w-48 md:w-56 lg:w-64 aspect-video rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0 cursor-pointer group/image" 
                          onClick={() => handlePlayVideo(video)}
                        >
                          <Image
                            src={video.posterUrl}
                            alt={video.title}
                            fill
                            className="object-cover group-hover/image:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, 256px"
                            quality={90}
                          />
                          <div className="absolute inset-0 bg-black/60 group-hover/image:bg-black/40 transition-colors flex items-center justify-center">
                            <Button
                              size="icon"
                              className="bg-white text-black hover:bg-white/90 rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-2xl transition-all hover:scale-110"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayVideo(video);
                              }}
                            >
                              <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-black" />
                            </Button>
                          </div>
                          {video.duration && (
                            <span className="absolute bottom-2 right-2 bg-black/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium">
                              {formatTime(video.duration)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <h3 className="text-white font-bold text-lg sm:text-xl mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                              {video.title}
                            </h3>
                            
                            <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-400 mb-4">
                              <span className="flex items-center gap-1.5">
                                <span className="text-gray-500">Agregado:</span>
                                <span className="text-gray-300">{formatDate(video.addedAt)}</span>
                              </span>
                              {video.width && video.height && (
                                <span className="flex items-center gap-1.5">
                                  <span className="text-gray-500">Resolución:</span>
                                  <span className="text-gray-300">{video.width}×{video.height}</span>
                                </span>
                              )}
                              {video.user && (
                                <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                                  <span className="text-gray-500">Por:</span>
                                  <span className="text-gray-300 truncate">{video.user.name}</span>
                                </span>
                              )}
                            </div>

                            {video.tags && video.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {video.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-full text-xs sm:text-sm font-medium border border-cyan-500/20"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3 mt-4">
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayVideo(video);
                              }}
                              className="
                                flex-1 sm:flex-none
                                border-cyan-500/30 bg-transparent hover:bg-cyan-500/10
                                text-cyan-400 hover:text-cyan-300
                                hover:border-cyan-500/50
                                transition-all duration-200
                                cursor-pointer
                              "
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Reproducir
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFavorite(video.id, e);
                              }}
                              className="
                                border-red-500/30 bg-transparent hover:bg-red-500/10
                                text-red-400 hover:text-red-300
                                hover:border-red-500/50
                                transition-all duration-200
                                cursor-pointer
                              "
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span className="hidden sm:inline">Quitar</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="
                      border border-white/10 bg-transparent hover:bg-white/5
                      text-gray-400 hover:text-white
                      hover:border-white/20
                      disabled:opacity-30 disabled:cursor-not-allowed
                      disabled:hover:bg-transparent disabled:hover:border-white/10
                      disabled:hover:text-gray-400
                      h-10 w-10 transition-all duration-200 cursor-pointer
                      rounded-lg
                    "
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  {getPageNumbers().map((page, idx) => (
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="text-gray-500 px-2 text-sm">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={page}
                        variant="ghost"
                        onClick={() => goToPage(page as number)}
                        className={`
                          min-w-[40px] h-10 text-sm font-medium
                          transition-all duration-200 cursor-pointer rounded-lg
                          ${
                            currentPage === page
                              ? 'bg-cyan-500 text-white border border-cyan-500 hover:bg-cyan-600 hover:border-cyan-600'
                              : 'border border-white/10 bg-transparent text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/20'
                          }
                        `}
                      >
                        {page}
                      </Button>
                    )
                  ))}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="
                      border border-white/10 bg-transparent hover:bg-white/5
                      text-gray-400 hover:text-white
                      hover:border-white/20
                      disabled:opacity-30 disabled:cursor-not-allowed
                      disabled:hover:bg-transparent disabled:hover:border-white/10
                      disabled:hover:text-gray-400
                      h-10 w-10 transition-all duration-200 cursor-pointer
                      rounded-lg
                    "
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {selectedVideo && isModalOpen && selectedVideo && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          video={{
            id: selectedVideo.id,
            title: selectedVideo.title,
            videoUrl: selectedVideo.videoUrl,
            posterUrl: selectedVideo.posterUrl,
            duration: selectedVideo.duration,
            tags: selectedVideo.tags,
            user: selectedVideo.user,
            width: selectedVideo.width,
            height: selectedVideo.height,
          }}
        />
      )}
    </div>
  );
}