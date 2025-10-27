'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/ui/header/Header';
import { Button } from '@/components/ui/button';
import { HeroBanner } from '@/components/ui/hero/HeroBanner';
import { FeaturesSection } from '@/components/ui/features/FeaturesSection';
import { InfiniteCarousel } from '@/components/ui/carousel/InfiniteCarousel';
import { HeroBannerSkeleton } from '@/components/ui/LoadingStates';
import { RegisterModal } from '@/components/ui/auth/RegisterModal';
import { LoginModal } from '@/components/ui/auth/LoginModal';
import { useFeaturedVideo } from '@/lib/hooks/useVideos';
import { videosAPI } from '@/lib/api/videos';
import { Movie } from '@/lib/types';

const INITIAL_PAGE = 1;
const VIDEOS_PER_PAGE = 15;

export default function LandingPage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [exclusiveVideos, setExclusiveVideos] = useState<Movie[]>([]);
  const [popularPage, setPopularPage] = useState(INITIAL_PAGE);
  const [hasMore, setHasMore] = useState(true);
  const [loadingExclusive, setLoadingExclusive] = useState(true);

  const { featured, loading: loadingFeatured } = useFeaturedVideo();

  useEffect(() => {
    loadInitialVideos();
  }, []);

  const loadInitialVideos = async () => {
    try {
      setLoadingExclusive(true);
      const movies = await videosAPI.getPopular({ 
        page: INITIAL_PAGE, 
        per_page: VIDEOS_PER_PAGE 
      });
      setExclusiveVideos(movies);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoadingExclusive(false);
    }
  };

  const loadMoreVideos = async () => {
    const nextPage = popularPage + 1;
    try {
      const movies = await videosAPI.getPopular({ 
        page: nextPage, 
        per_page: VIDEOS_PER_PAGE 
      });
      
      if (movies.length === 0) {
        setHasMore(false);
      } else {
        setExclusiveVideos(prev => [...prev, ...movies]);
        setPopularPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more videos:', error);
    }
  };

  const handleOpenLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleOpenRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleCloseLogin = () => setIsLoginModalOpen(false);
  const handleCloseRegister = () => setIsRegisterModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      <Header onOpenLogin={handleOpenLogin} />

      <main className="pt-20 overflow-x-hidden">
        <section>
          {loadingFeatured ? (
            <HeroBannerSkeleton />
          ) : featured ? (
            <HeroBanner
              title="Una Experiencia Ilimitada"
              description="Disfruta de estrenos exclusivos, clásicos y contenido original"
              backdropUrl="https://res.cloudinary.com/dwlh82pza/image/upload/v1760488463/5_vxdplj.jpg"
              onPlay={() => console.log('Hero play clicked - preview mode')}
              isPreview={true}
              badgeText=""
              badgeColor="bg-cyan-600"
              titleColor="text-cyan-400"
              customButton={
                <Button 
                  size="default"
                  className="bg-cyan-600 text-white hover:bg-cyan-700 font-semibold text-sm sm:text-base h-9 sm:h-10 lg:h-11 px-4 sm:px-5 lg:px-6"
                  onClick={handleOpenRegister}
                >
                  Registrarse
                </Button>
              }
            />
          ) : null}
        </section>

        <FeaturesSection />

        <section className="py-8 sm:py-12 lg:py-16">
          {loadingExclusive ? (
            <div className="px-4 md:px-12">
              <div className="h-8 w-48 bg-gray-800 rounded animate-pulse mb-4" />
              <div className="flex gap-4 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-48 md:w-56">
                    <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
                    <div className="h-4 bg-gray-800 rounded mt-2 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ) : exclusiveVideos && exclusiveVideos.length > 0 ? (
            <InfiniteCarousel
              title="Estrenos Exclusivos"
              movies={exclusiveVideos}
              onLoadMore={loadMoreVideos}
              hasMore={hasMore}
              scrollSpeed={0.5}
              isPreview={true}
            />
          ) : null}
        </section>

        <div className="pb-12 sm:pb-16 lg:pb-20" />
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLogin}
        onOpenRegister={handleOpenRegister}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegister}
        onOpenLogin={handleOpenLogin}
      />
    </div>
  );
}
