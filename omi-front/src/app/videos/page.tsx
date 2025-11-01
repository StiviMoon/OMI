'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar/sidebar';
import { HeroBanner } from '@/components/ui/hero/HeroBanner';
import { ContentSection } from '@/components/ui/content/ContentSection';
import { VideoModal } from '@/components/ui/movie/VideoModal';
import { useVideos, useFeaturedVideo } from '@/lib/hooks/useVideos';
import { Movie } from '@/lib/types';

const VIDEOS_PER_SECTION = 15;

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

export default function VideosPage() {
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Movie | null>(null);
  
  const { movies: popularVideos, loading: loadingPopular } = useVideos({
    type: 'popular',
    popularParams: { per_page: VIDEOS_PER_SECTION }
  });

  const { movies: natureVideos, loading: loadingNature } = useVideos({
    type: 'category',
    query: 'nature',
    searchParams: { per_page: VIDEOS_PER_SECTION, orientation: 'landscape' }
  });

  const { movies: cityVideos, loading: loadingCity } = useVideos({
    type: 'category',
    query: 'city',
    searchParams: { per_page: VIDEOS_PER_SECTION }
  });

  const { movies: technologyVideos, loading: loadingTechnology } = useVideos({
    type: 'category',
    query: 'technology',
    searchParams: { per_page: VIDEOS_PER_SECTION }
  });

  const { featured, loading: loadingFeatured } = useFeaturedVideo();

  const handleHeroPlay = () => {
    setFeaturedModalOpen(true);
  };

  const handleVideoSelect = (movie: Movie) => {
    setSelectedVideo(movie);
  };

  const handleCloseFeaturedModal = () => setFeaturedModalOpen(false);
  const handleCloseVideoModal = () => setSelectedVideo(null);

  const hasVideos = popularVideos?.length > 0 || 
                    natureVideos?.length > 0 || 
                    cityVideos?.length > 0 || 
                    technologyVideos?.length > 0;

  const allLoaded = !loadingPopular && !loadingNature && !loadingCity && !loadingTechnology;

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      <Sidebar onVideoSelect={handleVideoSelect} />
      
      <main className="flex-1 overflow-x-hidden ml-0 md:ml-[60px] lg:ml-[120px] w-full md:w-[calc(100vw-60px)] lg:w-[calc(100vw-120px)] transition-all duration-300">
        <div className="w-full overflow-x-hidden">
          {loadingFeatured ? (
            <div className="h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-800 animate-pulse rounded-lg mx-4 sm:mx-8 lg:mx-16 mt-16 md:mt-8" />
          ) : featured ? (
            <HeroBanner
              title={featured.title}
              description={featured.description}
              backdropUrl={featured.backdropUrl}
              videoUrl={featured.videoUrl}
              onPlay={handleHeroPlay}
            />
          ) : null}
          
          <div className="space-y-8 sm:space-y-10 lg:space-y-12 pb-12 sm:pb-14 lg:pb-16 overflow-x-hidden">
            {loadingPopular ? (
              <LoadingSkeleton />
            ) : popularVideos && popularVideos.length > 0 ? (
              <ContentSection title="Videos Populares" movies={popularVideos} />
            ) : null}

            {loadingNature ? (
              <LoadingSkeleton />
            ) : natureVideos && natureVideos.length > 0 ? (
              <ContentSection title="Naturaleza" movies={natureVideos} />
            ) : null}

            {loadingCity ? (
              <LoadingSkeleton />
            ) : cityVideos && cityVideos.length > 0 ? (
              <ContentSection title="Ciudad" movies={cityVideos} />
            ) : null}

            {loadingTechnology ? (
              <LoadingSkeleton />
            ) : technologyVideos && technologyVideos.length > 0 ? (
              <ContentSection title="Tecnología" movies={technologyVideos} />
            ) : null}

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

      {featured && featuredModalOpen && (
        <VideoModal
          isOpen={featuredModalOpen}
          onClose={handleCloseFeaturedModal}
          video={{
            id: 'featured',
            title: featured.title,
            videoUrl: featured.videoUrl || '',
            posterUrl: featured.backdropUrl,
          }}
        />
      )}

      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={handleCloseVideoModal}
          video={selectedVideo}
        />
      )}
    </div>
  );
}
