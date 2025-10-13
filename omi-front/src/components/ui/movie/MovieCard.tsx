'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Plus, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoModal } from './VideoModal';

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
  onAddToList?: (id: string) => void;
  isInList?: boolean;
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
  onAddToList,
  isInList = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detectar si es dispositivo touch
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handlePlay = () => {
    setIsModalOpen(true);
  };

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToList?.(id);
  };

  // En dispositivos touch, toggle el overlay con tap
  const handleCardClick = () => {
    if (isTouchDevice && !isHovered) {
      setIsHovered(true);
      // Auto-ocultar después de 3 segundos
      setTimeout(() => setIsHovered(false), 3000);
    } else {
      handlePlay();
    }
  };

  return (
    <>
      <Card 
        className="
          group relative flex-shrink-0 overflow-hidden rounded-lg border-0 bg-transparent cursor-pointer 
          transition-transform hover:scale-105
          w-[140px] sm:w-[170px] lg:w-[200px]
        "
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
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
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
                    className="
                      bg-gray-800/80 hover:bg-gray-700
                      h-7 w-7 sm:h-8 sm:w-8
                    "
                    onClick={handleAddToList}
                  >
                    {isInList ? (
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    ) : (
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Modal */}
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
        onAddToList={onAddToList}
        isInList={isInList}
      />
    </>
  );
};