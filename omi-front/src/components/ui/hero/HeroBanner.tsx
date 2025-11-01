'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface HeroBannerProps {
  title: string;
  description: string;
  backdropUrl: string;
  videoUrl?: string;
  onPlay: () => void;
  isPreview?: boolean;
  badgeText?: string;
  badgeColor?: string;
  titleColor?: string;
  customButton?: React.ReactNode;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  title, 
  description, 
  backdropUrl,
  videoUrl,
  onPlay,
  isPreview = false,
  badgeText,
  badgeColor,
  titleColor = 'text-white',
  customButton
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [showFallback, setShowFallback] = useState(!videoUrl);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    const handleCanPlay = () => {
      setVideoReady(true);
      setShowFallback(false);
      video.play().catch(() => {
        // Si falla el autoplay, mostrar fallback
        setShowFallback(true);
      });
    };

    const handleError = () => {
      setShowFallback(true);
      setVideoReady(false);
    };

    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('error', handleError);
    video.load();

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <section className="
      relative overflow-hidden w-full
      h-[56.25vw] min-h-[400px] max-h-[80vh]
      mt-16 md:mt-0
    ">
      {/* Video Background Container */}
      <div className="absolute inset-0 w-full h-full bg-black">
        {/* Fallback Image mientras carga o si no hay video */}
        {(showFallback || !videoReady) && (
          <div className="absolute inset-0">
            <Image
              src={backdropUrl}
              alt={title}
              fill
              quality={95}
              priority
              className={`
                object-cover transition-opacity duration-1000
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              loading="eager"
              sizes="100vw"
              onLoad={handleImageLoad}
            />
          </div>
        )}

        {/* Video de fondo estilo Netflix */}
        {videoUrl && (
          <video
            ref={videoRef}
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-opacity duration-1000
              ${videoReady && !showFallback ? 'opacity-100' : 'opacity-0'}
            `}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={backdropUrl}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}

        {/* Gradientes superpuestos estilo Netflix */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
        
        {/* Gradiente lateral derecho para mejor contraste */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-black/60 to-transparent" />
      </div>
      
      {/* Content Overlay - Estilo Netflix */}
      <div className="
        relative z-10 flex h-full items-end lg:items-center
        px-4 sm:px-8 lg:px-12 xl:px-16
        pb-12 sm:pb-16 lg:pb-8
      ">
        <div className="
          w-full max-w-[90%] sm:max-w-2xl lg:max-w-3xl
          transition-all duration-700 ease-out
          opacity-100 translate-y-0
        ">
          {/* Badge opcional */}
          {(badgeText || title) && (
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className={`px-3 py-1.5 ${badgeColor || 'bg-red-600'} text-white text-xs font-bold rounded`}>
                {badgeText || 'NOVEDAD'}
              </span>
            </div>
          )}

          {/* Título principal */}
          <h1 className={`
            font-black ${titleColor}
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl
            mb-3 sm:mb-4 lg:mb-6
            leading-[1.1] tracking-tight
            drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]
          `}>
            {title}
          </h1>

          {/* Descripción */}
          <p className="
            text-white/90 leading-relaxed
            text-sm sm:text-base lg:text-lg xl:text-xl
            mb-4 sm:mb-6 lg:mb-8
            font-normal
            line-clamp-2 sm:line-clamp-3
            drop-shadow-lg
            max-w-xl
          ">
            {description}
          </p>

          {/* Botones de acción estilo Netflix */}
          <div className="flex gap-3 sm:gap-4 flex-wrap">
            {!isPreview && (
              <Button 
                size="lg"
                className="
                  bg-white text-black hover:bg-white/90
                  font-bold
                  text-sm sm:text-base lg:text-lg
                  h-11 sm:h-12 lg:h-14
                  px-6 sm:px-8 lg:px-10
                  rounded-md
                  shadow-2xl
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                  flex items-center gap-2
                "
                onClick={onPlay}
                aria-label={`Reproducir ${title}`}
              >
                <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-black" />
                Reproducir
              </Button>
            )}
            {customButton}
          </div>
        </div>
      </div>

      {/* Borde inferior con degradado */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
};