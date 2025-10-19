'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Plus, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoModal } from './VideoModal';

/**
 * Props for the {@link MovieCard} component.
 * 
 * @interface MovieCardProps
 */
interface MovieCardProps {
  /** Unique identifier for the video or movie. */
  id: string;
  /** Display title for the video or movie. */
  title: string;
  /** Poster image URL for the thumbnail. */
  posterUrl: string;
  /** Video playback URL. */
  videoUrl: string;
  /** Optional video duration in seconds. */
  duration?: number;
  /** List of tags or categories related to the video. */
  tags?: string[];
  /** Information about the video uploader or creator. */
  user?: {
    name: string;
    url: string;
  };
  /** Optional video width in pixels. */
  width?: number;
  /** Optional video height in pixels. */
  height?: number;
  /** Optional release year or creation date. */
  year?: number;
  /** Optional numeric rating for the video. */
  rating?: number;
  /** Callback triggered when adding/removing from favorites. */
  onAddToList?: (id: string) => void;
  /** Indicates whether the video is already in the user’s list. */
  isInList?: boolean;
}

/**
 * Interactive movie/video card component.
 * 
 * Displays a thumbnail with hover/touch overlays containing controls to:
 * - Play the video in a modal.
 * - Add or remove the video from the user's list.
 * 
 * Features:
 * - Smooth hover animations and gradients.
 * - Touch-device detection for tap-based overlay.
 * - Responsive sizing for different breakpoints.
 * - Lazy-loaded modals for performance.
 * 
 * @component
 * @example
 * <MovieCard
 *   id="123"
 *   title="City Lights"
 *   posterUrl="/images/city.jpg"
 *   videoUrl="/videos/city.mp4"
 *   year={2024}
 *   onAddToList={(id) => console.log('Added:', id)}
 *   isInList={false}
 * />
 * 
 * @param {MovieCardProps} props - Component props.
 * @returns {JSX.Element} A responsive, interactive movie card.
 */
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

  // ======= DEVICE DETECTION =======
  /**
   * Detects whether the current device is touch-enabled.
   * Used to switch between hover and tap interactions.
   */
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // ======= HANDLERS =======

  /**
   * Opens the video modal for playback.
   */
  const handlePlay = () => {
    setIsModalOpen(true);
  };

  /**
   * Toggles video in/out of favorites list.
   * Stops event propagation to prevent modal triggering.
   */
  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToList?.(id);
  };

  /**
   * Handles click/tap behavior:
   * - On touch devices, shows overlay temporarily.
   * - On desktop, triggers video playback modal.
   */
  const handleCardClick = () => {
    if (isTouchDevice && !isHovered) {
      setIsHovered(true);
      // Auto-hide overlay after 3 seconds
      setTimeout(() => setIsHovered(false), 3000);
    } else {
      handlePlay();
    }
  };

  // ======= RENDER =======
  return (
    <>
      {/* ======= Movie Thumbnail Card ======= */}
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
          {/* Poster Image */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <Image 
              src={posterUrl} 
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Hover / Tap Overlay */}
            <div
              className={`
                absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent 
                transition-opacity duration-300 
                ${isHovered ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <div className="flex flex-col justify-end h-full p-3 sm:p-4">
                {/* Video Title */}
                <h3 className="
                  text-white font-semibold line-clamp-2 mb-1 sm:mb-2
                  text-xs sm:text-sm
                ">
                  {title}
                </h3>

                {/* Year */}
                {year && (
                  <p className="text-gray-400 text-[10px] sm:text-xs mb-2 sm:mb-3">
                    {year}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {/* Play Button */}
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

                  {/* Add/Remove Button */}
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

      {/* ======= Video Modal ======= */}
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
