'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar/sidebar';
import { HeroBanner } from '@/components/ui/hero/HeroBanner';
import { ContentSection } from '@/components/ui/content/ContentSection';
import { VideoModal } from '@/components/ui/movie/VideoModal';
import { useVideos, useFeaturedVideo } from '@/lib/hooks/useVideos';
import { Movie } from '@/lib/types';

// Componente para los skeletons de carga - RESPONSIVE
const LoadingSkeleton = () => (
  <div className="px-4 sm:px-8 lg:px-16 py-8">
    <div className="h-6 sm:h-8 w-32 sm:w-48 bg-gray-800 rounded mb-6 animate-pulse" />
    <div className="flex gap-2 sm:gap-3 lg:gap-4 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="w-[140px] sm:w-[170px] lg:w-[200px] h-[210px] sm:h-[255px] lg:h-[300px] bg-gray-800 rounded-lg animate-pulse flex-shrink-0" 
        />
      ))}
    </div>
  </div>
);

export default function Page() {
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Movie | null>(null);
  
  // Consumir datos de tu backend
  const { movies: popularVideos, loading: loadingPopular } = useVideos({
    type: 'popular',
    popularParams: { per_page: 15 }
  });

  const { movies: natureVideos, loading: loadingNature } = useVideos({
    type: 'category',
    query: 'nature',
    searchParams: { per_page: 15, orientation: 'landscape' }
  });

  const { movies: cityVideos, loading: loadingCity } = useVideos({
    type: 'category',
    query: 'city',
    searchParams: { per_page: 15 }
  });

  const { movies: technologyVideos, loading: loadingTechnology } = useVideos({
    type: 'category',
    query: 'technology',
    searchParams: { per_page: 15 }
  });

  const { featured, loading: loadingFeatured } = useFeaturedVideo();

  // ❌ ELIMINAR - Ya no es necesario
  // const handleAddToList = (id: string) => {
  //   console.log('Video added to list:', id);
  // };

  const handleHeroPlay = () => {
    setFeaturedModalOpen(true);
  };

  // Handler para cuando se selecciona un video desde el SearchModal
  const handleVideoSelect = (movie: Movie) => {
    setSelectedVideo(movie);
  };

  // Verificar si hay videos disponibles
  const hasVideos = popularVideos?.length > 0 || 
                    natureVideos?.length > 0 || 
                    cityVideos?.length > 0 || 
                    technologyVideos?.length > 0;

  const allLoaded = !loadingPopular && !loadingNature && !loadingCity && !loadingTechnology;

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      <Sidebar onVideoSelect={handleVideoSelect} />
      
      {/* Main Content con márgenes responsive */}
      <main className="
        flex-1 overflow-x-hidden
        ml-0 md:ml-[60px] lg:ml-[120px]
        w-full md:w-[calc(100vw-60px)] lg:w-[calc(100vw-120px)]
        transition-all duration-300
      ">
        <div className="w-full overflow-x-hidden">
          {/* Hero Banner */}
          {loadingFeatured ? (
            <div className="
              h-[300px] sm:h-[400px] lg:h-[500px] 
              bg-gray-800 animate-pulse rounded-lg 
              mx-4 sm:mx-8 lg:mx-16 
              mt-16 md:mt-8
            " />
          ) : featured ? (
            <HeroBanner
              title={featured.title}
              description={featured.description}
              backdropUrl={featured.backdropUrl}
              onPlay={handleHeroPlay}
            />
          ) : null}
          
          <div className="space-y-8 sm:space-y-10 lg:space-y-12 pb-12 sm:pb-14 lg:pb-16 overflow-x-hidden">
            {/* Videos Populares */}
            {loadingPopular ? (
              <LoadingSkeleton />
            ) : popularVideos && popularVideos.length > 0 ? (
              <ContentSection
                title="Videos Populares"
                movies={popularVideos}
              />
            ) : null}

            {/* Naturaleza */}
            {loadingNature ? (
              <LoadingSkeleton />
            ) : natureVideos && natureVideos.length > 0 ? (
              <ContentSection
                title="Naturaleza"
                movies={natureVideos}
              />
            ) : null}

            {/* Ciudad */}
            {loadingCity ? (
              <LoadingSkeleton />
            ) : cityVideos && cityVideos.length > 0 ? (
              <ContentSection
                title="Ciudad"
                movies={cityVideos}
              />
            ) : null}

            {/* Tecnología */}
            {loadingTechnology ? (
              <LoadingSkeleton />
            ) : technologyVideos && technologyVideos.length > 0 ? (
              <ContentSection
                title="Tecnología"
                movies={technologyVideos}
              />
            ) : null}

            {/* Mensaje cuando no hay videos */}
            {allLoaded && !hasVideos && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center px-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    No se pudieron cargar los videos
                  </h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    Por favor, verifica tu conexión e intenta nuevamente.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ✅ Modal para el video destacado - SIN onAddToList */}
      {featured && featuredModalOpen && (
        <VideoModal
          isOpen={featuredModalOpen}
          onClose={() => setFeaturedModalOpen(false)}
          video={{
            id: 'featured',
            title: featured.title,
            videoUrl: featured.videoUrl || '',
            posterUrl: featured.backdropUrl,
          }}
        />
      )}

      {/* ✅ Modal para videos seleccionados desde búsqueda - SIN onAddToList */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          video={selectedVideo}
        />
      )}
    </div>
  );
}