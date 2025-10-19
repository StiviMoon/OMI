'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

/**
 * Props for the {@link HeroBanner} component.
 * 
 * @interface HeroBannerProps
 */
interface HeroBannerProps {
  /** Title of the featured video or content. */
  title: string;
  /** Short description or tagline displayed under the title. */
  description: string;
  /** Background image URL used as the hero backdrop. */
  backdropUrl: string;
  /** Callback triggered when the play button is clicked. */
  onPlay: () => void;
}

/**
 * Hero banner component for displaying featured video content.
 * 
 * This component includes:
 * - A full-width background image with layered gradient overlays.
 * - Responsive typography and layout scaling for different viewports.
 * - A prominent “Play” button that triggers a modal or playback action.
 * - A “NEW” badge to emphasize recent or highlighted content.
 * 
 * @component
 * @example
 * <HeroBanner
 *   title="Stunning Nature"
 *   description="Explore breathtaking landscapes captured from around the world."
 *   backdropUrl="/images/nature-bg.jpg"
 *   onPlay={() => console.log('Play clicked!')}
 * />
 * 
 * @param {HeroBannerProps} props - The component props.
 * @returns {JSX.Element} A responsive, visually rich hero banner section.
 */
export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  title, 
  description, 
  backdropUrl, 
  onPlay, 
}) => {
  return (
    <section
      className="
        relative overflow-hidden w-full
        h-[300px] sm:h-[400px] lg:h-[500px]
        mt-16 md:mt-0
      "
    >
      {/* ======= Background Image ======= */}
      <div className="absolute inset-0 w-full">
        <Image 
          src={backdropUrl} 
          alt={title} 
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-purple-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
      
      {/* ======= Content Overlay ======= */}
      <div
        className="
          relative z-10 flex h-full items-center
          px-4 sm:px-8 lg:px-16
        "
      >
        <div
          className="
            w-full sm:max-w-xl lg:max-w-2xl
          "
        >
          {/* Status Badge */}
          <Badge
            className="
              mb-2 sm:mb-3 lg:mb-4 
              bg-pink-600 hover:bg-pink-700 text-white border-0
              text-xs sm:text-sm
            "
          >
            NEW
          </Badge>

          {/* Title */}
          <h1
            className="
              font-bold text-pink-500 drop-shadow-2xl
              text-3xl sm:text-5xl lg:text-7xl
              mb-2 sm:mb-3 lg:mb-4
            "
          >
            {title}
          </h1>

          {/* Description */}
          <p
            className="
              text-gray-200 leading-relaxed line-clamp-2 sm:line-clamp-3 drop-shadow-lg
              text-sm sm:text-base lg:text-lg
              mb-4 sm:mb-5 lg:mb-6
            "
          >
            {description}
          </p>

          {/* Play Button */}
          <div className="flex gap-3 sm:gap-4">
            <Button 
              size="default"
              className="
                bg-white text-black hover:bg-gray-200 font-semibold
                text-sm sm:text-base
                h-9 sm:h-10 lg:h-11
                px-4 sm:px-5 lg:px-6
              "
              onClick={onPlay}
            >
              <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 fill-black" />
              Play
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
