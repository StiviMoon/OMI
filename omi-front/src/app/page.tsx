'use client';

import React, { useState } from 'react';
import { Header as HeaderOriginal } from '@/components/ui/header/Header';
const Header = HeaderOriginal as unknown as React.ComponentType<{ onOpenLogin: () => void }>;
import { Button } from '@/components/ui/button';

import { HeroBanner } from '@/components/ui/hero/HeroBanner';
import { FeaturesSection } from '@/components/ui/features/FeaturesSection';
import { InfiniteCarousel } from '@/components/ui/carousel/InfiniteCarousel';
import { 
  HeroBannerSkeleton 
} from '@/components/ui/LoadingStates';
import { useFeaturedVideo } from '@/lib/hooks/useVideos';
import { videosAPI } from '@/lib/api/videos';
import { Movie } from '@/lib/types';

import { RegisterModal } from '@/components/ui/auth/RegisterModal';
import { LoginModal } from '@/components/ui/auth/LoginModal';

export default function LandingPage() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Estados para el carrusel
  const [exclusiveVideos, setExclusiveVideos] = useState<Movie[]>([]);
  const [popularPage, setPopularPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingExclusive, setLoadingExclusive] = useState(true);

  const { featured, loading: loadingFeatured } = useFeaturedVideo();

  // Cargar videos iniciales
  React.useEffect(() => {
    loadInitialVideos();
  }, []);

  const loadInitialVideos = async () => {
    try {
      setLoadingExclusive(true);
      const movies = await videosAPI.getPopular({ 
        page: 1, 
        per_page: 15 
      });
      setExclusiveVideos(movies);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoadingExclusive(false);
    }
  };

  // Cargar más videos
  const loadMoreVideos = async () => {
    const nextPage = popularPage + 1;
    try {
      const movies = await videosAPI.getPopular({ 
        page: nextPage, 
        per_page: 15 
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

  const openLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleHeroPlay = () => {
    console.log('Hero play clicked - but is preview mode');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      {/* Header */}
      <Header onOpenLogin={() => setIsLoginModalOpen(true)} />

      {/* Main Content */}
      <main className="pt-20 overflow-x-hidden">
        {/* Hero Banner */}
        <section>
          {loadingFeatured ? (
            <HeroBannerSkeleton />
          ) : featured ? (
            <HeroBanner
              title="Una Experiencia Ilimitada"
              description="Disfruta de estrenos exclusivos, clásicos y contenido original"
              backdropUrl="https://res.cloudinary.com/dwlh82pza/image/upload/v1760488463/5_vxdplj.jpg"
              onPlay={handleHeroPlay}
              isPreview={true}
              badgeText=""
              badgeColor="bg-cyan-600"
              titleColor="text-cyan-400"
              customButton={
                <Button 
                  size="default"
                  className="
                    bg-cyan-600 text-white hover:bg-cyan-700 font-semibold
                    text-sm sm:text-base
                    h-9 sm:h-10 lg:h-11
                    px-4 sm:px-5 lg:px-6
                  "
                  onClick={() => setIsRegisterModalOpen(true)}
                >
                  Registrarse
                </Button>
              }
            />
          ) : null}
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* Estrenos Exclusivos - Carrusel Infinito */}
        <section className="py-8 sm:py-12 lg:py-16">
          {loadingExclusive ? (
            <div className="px-4 md:px-12">
              <div className="h-8 w-48 bg-gray-800 rounded animate-pulse mb-4"></div>
              <div className="flex gap-4 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-48 md:w-56">
                    <div className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"></div>
                    <div className="h-4 bg-gray-800 rounded mt-2 animate-pulse"></div>
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

        {/* Footer Spacing */}
        <div className="pb-12 sm:pb-16 lg:pb-20" />
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenRegister={openRegister}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onOpenLogin={openLogin}
      />
    </div>
  );
}