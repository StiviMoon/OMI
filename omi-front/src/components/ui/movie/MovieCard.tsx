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
  console.log('🎬 MovieCard Render:', { title, isPreview });
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Verificar si está en favoritos al montar el componente
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
    console.log('🖱️ Card clicked, isPreview:', isPreview);
    if (isPreview) {
      console.log('⛔ Blocked by preview mode');
      return;
    }
    if (isTouchDevice && !isHovered) {
      setIsHovered(true);
      setTimeout(() => setIsHovered(false), 3000);
    } else {
      handlePlay();
    }
  };

  // Callback para actualizar favoritos cuando cambian en el modal
  const handleFavoriteUpdate = (newState: boolean) => {
    setIsInFavorites(newState);
  };

  return (
    <>
      <Card 
        className={`
          group relative flex-shrink-0 overflow-hidden rounded-lg border-0 bg-transparent
          transition-transform hover:scale-105
          w-[140px] sm:w-[170px] lg:w-[200px]
          ${isPreview ? 'cursor-default' : 'cursor-pointer'}
        `}
        onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
        onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              sizes="(max-width: 640px) 140px, (max-width: 1024px) 170px, 200px"
            />
            
            {/* Overlay on hover/tap */}
            <div className={`
              absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent 
              transition-opacity duration-300 
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}>
              <div className="flex flex-col justify-end h-full p-3 sm:p-4">
                <h3 className="
                  text-white font-semibold line-clamp-2 mb-1 sm:mb-2
                  text-xs sm:text-sm
                ">
                  {title}
                </h3>
                {year && (
                  <p className="text-gray-400 text-[10px] sm:text-xs mb-2 sm:mb-3">
                    {year}
                  </p>
                )}
                {!isPreview && (
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="
                        bg-white hover:bg-gray-200
                        h-7 w-7 sm:h-8 sm:w-8
                      "
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay();
                      }}
                    >
                      <Play className="h-3 w-3 sm:h-4 sm:w-4 text-black fill-black" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className={`
                        h-7 w-7 sm:h-8 sm:w-8
                        transition-colors
                        ${isInFavorites 
                          ? 'bg-cyan-500 hover:bg-cyan-600' 
                          : 'bg-gray-800/80 hover:bg-gray-700'
                        }
                      `}
                      onClick={handleToggleFavorite}
                      disabled={isLoadingFavorite}
                    >
                      {isLoadingFavorite ? (
                        <div className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : isInFavorites ? (
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      ) : (
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Modal */}
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