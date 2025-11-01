'use client';

import React, { useState, useEffect } from 'react';
import { Play, Plus, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoModal } from './VideoModal';
import Image from 'next/image';
import { toggleFavorite, isFavorite } from '@/lib/favorites';

interface MovieCardProps {
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
  isPreview?: boolean;
}

// Placeholder blur data URL para evitar imágenes borrosas
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g-${w}-${h}">
      <stop stop-color="#1f2937" offset="20%" />
      <stop stop-color="#374151" offset="50%" />
      <stop stop-color="#1f2937" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#1f2937" />
  <rect id="r-${w}-${h}" width="${w}" height="${h}" fill="url(#g-${w}-${h})" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export const MovieCard: React.FC<MovieCardProps> = ({ 
  id, 
  title, 
  posterUrl,
  videoUrl,
  duration,
  tags,
  user,
  width,
  height,
  year,
  isPreview = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    const checkFavorite = async () => {
      const inFavorites = await isFavorite(id);
      setIsInFavorites(inFavorites);
    };
    checkFavorite();
  }, [id]);

  const handlePlay = () => {
    if (isPreview) return;
    setIsModalOpen(true);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPreview || isLoadingFavorite) return;
    
    setIsLoadingFavorite(true);
    try {
      const videoData = {
        id,
        title,
        posterUrl,
        videoUrl,
        duration,
        tags,
        user,
        width,
        height,
      };
      
      const success = await toggleFavorite(videoData);
      if (success) {
        setIsInFavorites(!isInFavorites);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const handleCardClick = () => {
    if (isPreview) return;
    if (isTouchDevice && !isHovered) {
      setIsHovered(true);
      setTimeout(() => setIsHovered(false), 3000);
    } else {
      handlePlay();
    }
  };

  const handleFavoriteUpdate = (newState: boolean) => {
    setIsInFavorites(newState);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(200, 300))}`;

  return (
    <>
      <Card 
        className={`
          group relative flex-shrink-0 overflow-visible rounded-xl border-0 bg-transparent
          transition-all duration-300 ease-out
          w-[140px] sm:w-[170px] lg:w-[200px]
          ${isPreview ? 'cursor-default' : 'cursor-pointer'}
          ${!isPreview && 'hover:scale-105 hover:z-10'}
          ${!isPreview && 'hover:shadow-2xl hover:shadow-cyan-500/20'}
        `}
        onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
        onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-lg">
            {/* Skeleton mientras carga */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full border-2 border-zinc-600 border-t-cyan-500 animate-spin" />
                </div>
              </div>
            )}

            {/* Imagen principal con alta calidad */}
            <Image
              src={imageError ? blurDataURL : posterUrl}
              alt={title}
              fill
              quality={90}
              priority={false}
              className={`
                object-cover transition-all duration-500 ease-out
                ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                ${isHovered && !isPreview ? 'scale-105' : 'scale-100'}
              `}
              loading="lazy"
              sizes="(max-width: 640px) 140px, (max-width: 1024px) 170px, 200px"
              placeholder="blur"
              blurDataURL={blurDataURL}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Overlay mejorado con mejor contraste */}
            <div className={`
              absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30
              transition-opacity duration-300 ease-out
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}>
              {/* Borde sutil en hover */}
              <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex flex-col justify-end h-full p-3 sm:p-4 relative z-10">
                <h3 className="
                  text-white font-bold line-clamp-2 mb-1 sm:mb-2
                  text-xs sm:text-sm
                  drop-shadow-lg
                  leading-tight
                ">
                  {title}
                </h3>
                {year && (
                  <p className="text-cyan-400 text-[10px] sm:text-xs mb-2 sm:mb-3 font-medium">
                    {year}
                  </p>
                )}
                {!isPreview && (
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="
                        bg-white/95 hover:bg-white text-black
                        h-8 w-8 sm:h-9 sm:w-9
                        shadow-lg hover:shadow-xl
                        transition-all duration-200
                        hover:scale-110 active:scale-95
                      "
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay();
                      }}
                      aria-label={`Reproducir ${title}`}
                    >
                      <Play className="h-4 w-4 sm:h-5 sm:w-5 text-black fill-black" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className={`
                        h-8 w-8 sm:h-9 sm:w-9
                        transition-all duration-200
                        shadow-lg hover:shadow-xl
                        hover:scale-110 active:scale-95
                        ${isInFavorites 
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-white' 
                          : 'bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm'
                        }
                      `}
                      onClick={handleToggleFavorite}
                      disabled={isLoadingFavorite}
                      aria-label={isInFavorites ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    >
                      {isLoadingFavorite ? (
                        <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : isInFavorites ? (
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      ) : (
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isPreview && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          video={{
            id,
            title,
            videoUrl,
            posterUrl,
            duration,
            tags,
            user,
            width,
            height,
          }}
          onFavoriteUpdate={handleFavoriteUpdate}
        />
      )}
    </>
  );
};