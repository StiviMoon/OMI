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
      const loadedFavorites = await getAllFavorites();
      setFavorites(loadedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
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
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Sidebar />
        <div className="flex-1 md:ml-[80px] lg:ml-[160px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Cargando favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Sidebar />
      
      <main className="flex-1 md:ml-[80px] lg:ml-[160px]">
        <div className="bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Mis Favoritos</h1>
                <span className="bg-cyan-500/20 text-cyan-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                  {favorites.length}
                </span>
              </div>

              {favorites.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAllFavorites}
                  className="border-red-500/80 bg-red-950/30 text-red-300 hover:bg-red-600 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/40 active:scale-95 text-sm w-full sm:w-auto transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar todo
                </Button>
              )}
            </div>

            {favorites.length > 0 && (
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar en favoritos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="flex gap-3 sm:gap-4">
                    {allTags.length > 0 && (
                      <div className="relative flex-1 sm:flex-none">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                        <select
                          value={filterTag}
                          onChange={(e) => setFilterTag(e.target.value)}
                          className="w-full pl-9 sm:pl-10 pr-8 py-2 text-sm sm:text-base bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 appearance-none cursor-pointer"
                        >
                          <option value="all">Todos los tags</option>
                          {allTags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex gap-1 sm:gap-2 bg-white/10 p-1 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        className={`h-8 w-8 sm:h-10 sm:w-10 ${viewMode === 'grid' ? 'bg-cyan-500/30 text-cyan-400' : 'text-gray-400'}`}
                      >
                        <Grid3x3 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewMode('list')}
                        className={`h-8 w-8 sm:h-10 sm:w-10 ${viewMode === 'list' ? 'bg-cyan-500/30 text-cyan-400' : 'text-gray-400'}`}
                      >
                        <List className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          {favorites.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <Heart className="h-16 w-16 sm:h-24 sm:w-24 text-gray-600 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">No tienes favoritos aún</h2>
              <p className="text-sm sm:text-base text-gray-400 mb-8">
                Empieza a agregar videos a tu lista de favoritos
              </p>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <Search className="h-16 w-16 sm:h-24 sm:w-24 text-gray-600 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">No se encontraron resultados</h2>
              <p className="text-sm sm:text-base text-gray-400">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                <p className="text-gray-400 text-xs sm:text-sm">
                  Mostrando <span className="hidden sm:inline">{startIndex + 1}-{Math.min(endIndex, filteredFavorites.length)} de </span>
                  <span className="sm:hidden">{startIndex + 1}-{Math.min(endIndex, filteredFavorites.length)}/</span>
                  {filteredFavorites.length} <span className="hidden sm:inline">favoritos</span>
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Página </span>
                  <span className="sm:hidden">Pág. </span>
                  {currentPage} <span className="hidden sm:inline">de </span>
                  <span className="sm:hidden">/</span> {totalPages}
                </p>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {currentFavorites.map((video) => (
                    <div
                      key={video.id}
                      className="group bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                      <div 
                        className="relative aspect-video overflow-hidden bg-gray-800 cursor-pointer" 
                        onClick={() => handlePlayVideo(video)}
                      >
                        <Image
                          src={video.posterUrl}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="icon"
                            className="bg-cyan-500 hover:bg-cyan-600 rounded-full w-12 h-12 sm:w-14 sm:h-14"
                          >
                            <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />
                          </Button>
                        </div>
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-semibold">
                            {formatTime(video.duration)}
                          </span>
                        )}
                      </div>

                      <div className="p-3 sm:p-4">
                        <h3 className="text-white text-sm sm:text-base font-semibold mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                          {video.title}
                        </h3>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                          <span className="truncate">Agregado: {formatDate(video.addedAt)}</span>
                          {video.width && video.height && (
                            <span className="ml-2 flex-shrink-0">{video.width}×{video.height}</span>
                          )}
                        </div>

                        {video.tags && video.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {video.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs truncate max-w-[100px]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => removeFavorite(video.id, e)}
                          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs sm:text-sm"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                          Quitar de favoritos
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {currentFavorites.map((video) => (
                    <div
                      key={video.id}
                      className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
                        <div 
                          className="relative w-full sm:w-48 md:w-64 aspect-video rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 cursor-pointer" 
                          onClick={() => handlePlayVideo(video)}
                        >
                          <Image
                            src={video.posterUrl}
                            alt={video.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 256px"
                          />
                          <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors flex items-center justify-center">
                            <Button
                              size="icon"
                              className="bg-cyan-500 hover:bg-cyan-600 rounded-full w-12 h-12 sm:w-14 sm:h-14"
                            >
                              <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />
                            </Button>
                          </div>
                          {video.duration && (
                            <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-semibold">
                              {formatTime(video.duration)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-white font-semibold text-base sm:text-lg mb-2">
                              {video.title}
                            </h3>
                            
                            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-3">
                              <span>📅 {formatDate(video.addedAt)}</span>
                              {video.width && video.height && (
                                <span>📐 {video.width}×{video.height}</span>
                              )}
                              {video.user && (
                                <span className="truncate max-w-[150px] sm:max-w-none">👤 {video.user.name}</span>
                              )}
                            </div>

                            {video.tags && video.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                {video.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 sm:px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs truncate max-w-[120px]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="mt-3 sm:mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => removeFavorite(video.id, e)}
                              className="w-full sm:w-auto border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs sm:text-sm"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                              Quitar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-6 sm:mt-8 flex items-center justify-center gap-1 sm:gap-2 flex-wrap px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="border border-gray-600 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-600 disabled:text-gray-600 h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>

                  {getPageNumbers().map((page, idx) => (
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="text-cyan-400 px-1 sm:px-2 text-sm sm:text-base">...</span>
                    ) : (
                      <Button
                        key={page}
                        variant="ghost"
                        onClick={() => goToPage(page as number)}
                        className={`border min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 text-sm sm:text-base transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-cyan-500 text-white border-cyan-500 hover:bg-cyan-600 hover:border-cyan-600'
                            : 'border-gray-600 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400'
                        }`}
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
                    className="border border-gray-600 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-600 disabled:text-gray-600 h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {selectedVideo && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          video={selectedVideo}
        />
      )}
    </div>
  );
}