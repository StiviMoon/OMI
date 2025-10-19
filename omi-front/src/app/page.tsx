'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar/sidebar';
import { HeroBanner } from '@/components/ui/hero/HeroBanner';
import { ContentSection } from '@/components/ui/content/ContentSection';
import { VideoModal } from '@/components/ui/movie/VideoModal';
import { useVideos, useFeaturedVideo } from '@/lib/hooks/useVideos';
import { Movie } from '@/lib/types';

/**
 * Skeleton component used while videos are being loaded.
 * 
 * Provides a responsive placeholder UI to enhance user experience during data fetching.
 * 
 * @component
 * @returns {JSX.Element} A skeleton layout mimicking the content structure.
 */
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

/**
 * Main page component for the OMI front-end.
 * 
 * This component renders:
 * - The sidebar navigation
 * - A featured video banner
 * - Multiple categorized video sections (Popular, Nature, City, Technology)
 * - Video modals for playback and interaction
 * 
 * It interacts with the custom `useVideos` and `useFeaturedVideo` hooks
 * to fetch data from the backend API, maintaining separate loading states for each section.
 * 
 * @page
 * @component
 * @example
 * // Rendered automatically by Next.js at route `/`
 * export default function Page() {
 *   return <OMIHomePage />;
 * }
 * 
 * @returns {JSX.Element} The full homepage layout.
 */
export default function Page() {
  // ======= STATE MANAGEMENT =======
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Movie | null>(null);
  
  // ======= FETCHING DATA FROM BACKEND =======
  const { movies: popularVideos, loading: loadingPopular } = useVideos({
    type: 'popular',
    popularParams: { per_page: 15 },
  });

  const { movies: natureVideos, loading: loadingNature } = useVideos({
    type: 'category',
    query: 'nature',
    searchParams: { per_page: 15, orientation: 'landscape' },
  });

  const { movies: cityVideos, loading: loadingCity } = useVideos({
    type: 'category',
    query: 'city',
    searchParams: { per_page: 15 },
  });

  const { movies: technologyVideos, loading: loadingTechnology } = useVideos({
    type: 'category',
    query: 'technology',
    searchParams: { per_page: 15 },
  });

  const { featured, loading: loadingFeatured } = useFeaturedVideo();

  // ======= HANDLERS =======

  /**
   * Handles adding a video to the user's list (placeholder logic).
   * 
   * @param {string} id - The ID of the video being added.
   */
  const handleAddToList = (id: string) => {
    console.log('Video added to list:', id);
  };

  /**
   * Opens the featured video modal when the hero banner play button is clicked.
   */
  const handleHeroPlay = () => {
    setFeaturedModalOpen(true);
  };

  /**
   * Handles video selection from the search modal in the sidebar.
   * 
   * @param {Movie} movie - The selected movie object.
   */
  const handleVideoSelect = (movie: Movie) => {
    setSelectedVideo(movie);
  };

  // ======= CONDITIONAL STATES =======
  const hasVideos =
    popularVideos?.length > 0 ||
    natureVideos?.length > 0 ||
    cityVideos?.length > 0 ||
    technologyVideos?.length > 0;

  const allLoaded =
    !loadingPopular && !loadingNature && !loadingCity && !loadingTechnology;

  // ======= RENDER =======
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar onVideoSelect={handleVideoSelect} />
      
      {/* Main Content */}
      <main
        className="
          flex-1 overflow-x-hidden
          ml-0 md:ml-[60px] lg:ml-[120px]
          w-full md:w-[calc(100vw-60px)] lg:w-[calc(100vw-120px)]
          transition-all duration-300
        "
      >
        <div className="w-full overflow-x-hidden">
          {/* Featured Hero Banner */}
          {loadingFeatured ? (
            <div
              className="
                h-[300px] sm:h-[400px] lg:h-[500px] 
                bg-gray-800 animate-pulse rounded-lg 
                mx-4 sm:mx-8 lg:mx-16 
                mt-16 md:mt-8
              "
            />
          ) : featured ? (
            <HeroBanner
              title={featured.title}
              description={featured.description}
              backdropUrl={featured.backdropUrl}
              onPlay={handleHeroPlay}
            />
          ) : null}

          {/* Video Categories */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-12 pb-12 sm:pb-14 lg:pb-16 overflow-x-hidden">
            {/* Popular Videos */}
            {loadingPopular ? (
              <LoadingSkeleton />
            ) : popularVideos?.length ? (
              <ContentSection
                title="Popular Videos"
                movies={popularVideos}
                onAddToList={handleAddToList}
              />
            ) : null}

            {/* Nature Category */}
            {loadingNature ? (
              <LoadingSkeleton />
            ) : natureVideos?.length ? (
              <ContentSection
                title="Nature"
                movies={natureVideos}
                onAddToList={handleAddToList}
              />
            ) : null}

            {/* City Category */}
            {loadingCity ? (
              <LoadingSkeleton />
            ) : cityVideos?.length ? (
              <ContentSection
                title="City"
                movies={cityVideos}
                onAddToList={handleAddToList}
              />
            ) : null}

            {/* Technology Category */}
            {loadingTechnology ? (
              <LoadingSkeleton />
            ) : technologyVideos?.length ? (
              <ContentSection
                title="Technology"
                movies={technologyVideos}
                onAddToList={handleAddToList}
              />
            ) : null}

            {/* Fallback Message */}
            {allLoaded && !hasVideos && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center px-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    Failed to load videos
                  </h2>
                  <p className="text-sm sm:text-base text-gray-400">
                    Please check your connection and try again.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Featured Video Modal */}
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
          onAddToList={handleAddToList}
        />
      )}

      {/* Modal for Videos Selected via Search */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          video={selectedVideo}
          onAddToList={handleAddToList}
        />
      )}
    </div>
  );
}
