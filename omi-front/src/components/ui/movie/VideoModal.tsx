'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Plus, Check, Play, Pause, Volume2, VolumeX, Maximize, Square, Subtitles, Languages, MessageCircle, ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleFavorite, isFavorite } from '@/lib/favorites';
import { CommentsSection } from '@/components/ui/comments/CommentsSection';
import { RatingSection } from '@/components/ui/rating/RatingSection';
import { SubtitleDisplay } from '@/components/ui/subtitles/SubtitleDisplay';
import { SubtitleLanguage } from '@/lib/subtitles';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    id: string;
    title: string;
    videoUrl: string;
    posterUrl: string;
    duration?: number;
    tags?: string[];
    user?: {
      name: string;
      url: string;
    };
    width?: number;
    height?: number;
  };
  onFavoriteUpdate?: (isInFavorites: boolean) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ 
  isOpen, 
  onClose, 
  video,
  onFavoriteUpdate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [subtitleLanguage, setSubtitleLanguage] = useState<SubtitleLanguage>('es');
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showRatingsDrawer, setShowRatingsDrawer] = useState(false);
  const [mobileTab, setMobileTab] = useState<'info' | 'ratings' | 'comments'>('info');
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const subtitleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkFavorite = async () => {
      if (isOpen && video.id) {
        const inFavorites = await isFavorite(video.id);
        setIsInFavorites(inFavorites);
      }
    };
    checkFavorite();
  }, [isOpen, video.id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showRatingsDrawer) {
          setShowRatingsDrawer(false);
        } else if (isFlipped) {
          setIsFlipped(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isFlipped, showRatingsDrawer]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoEl.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(videoEl.duration);
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    videoEl.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoEl.addEventListener('play', handlePlay);
    videoEl.addEventListener('pause', handlePause);
    videoEl.addEventListener('ended', handleEnded);

    return () => {
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoEl.removeEventListener('play', handlePlay);
      videoEl.removeEventListener('pause', handlePause);
      videoEl.removeEventListener('ended', handleEnded);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        subtitleMenuRef.current &&
        !subtitleMenuRef.current.contains(event.target as Node)
      ) {
        setShowSubtitleMenu(false);
      }
    };

    if (showSubtitleMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSubtitleMenu]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleToggleFavorite = async () => {
    setIsLoadingFavorite(true);
    try {
      const success = await toggleFavorite(video);
      if (success) {
        const newState = !isInFavorites;
        setIsInFavorites(newState);
        onFavoriteUpdate?.(newState);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const togglePlay = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    
    if (videoEl.paused) {
      videoEl.play();
    } else {
      videoEl.pause();
    }
  };

  const handleStop = () => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.pause();
      videoEl.currentTime = 0;
      setIsPlaying(false);
    }
    onClose();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    
    const newTime = parseFloat(e.target.value);
    videoEl.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    
    const newVolume = parseFloat(e.target.value);
    videoEl.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    
    if (isMuted) {
      videoEl.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoEl.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current?.parentElement;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = (isMuted ? 0 : volume) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl mx-4 bg-zinc-900 rounded-lg overflow-hidden shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="
            absolute top-2 right-[1px] sm:top-4 sm:right-4 z-10 
            bg-zinc-900/80 hover:bg-red-600/90
            text-white hover:text-white
            rounded-lg
            backdrop-blur-sm
            border border-zinc-700/50 hover:border-red-500/50
            transition-all duration-200
            cursor-pointer
            hover:scale-110 active:scale-95
            shadow-lg hover:shadow-red-500/30
            h-6 w-6 sm:h-7 sm:w-7
          "
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>

        {/* Mobile Tabs - Ahora incluye Ratings */}
        <div className="lg:hidden flex border-b border-zinc-800">
          <button
            onClick={() => setMobileTab('info')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'info'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Información
          </button>
          <button
            onClick={() => setMobileTab('ratings')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'ratings'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Calificación
          </button>
          <button
            onClick={() => setMobileTab('comments')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'comments'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Comentarios
          </button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[90vh]">
          <div className="lg:w-2/3 bg-black relative group" onMouseMove={handleMouseMove}>
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                src={video.videoUrl}
                poster={video.posterUrl}
                autoPlay
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
              >
                Tu navegador no soporta el elemento de video.
              </video>

              {showSubtitles && (
                <SubtitleDisplay
                  currentTime={currentTime}
                  duration={duration}
                  tags={video.tags}
                  title={video.title}
                  language={subtitleLanguage}
                />
              )}

              <div 
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="video-progress-slider w-full mb-3"
                  style={{
                    '--progress': `${progressPercent}%`
                  } as React.CSSProperties}
                />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleStop}
                      className="text-white hover:bg-white/20"
                      title="Detener y cerrar"
                    >
                      <Square className="h-5 w-5 fill-current" />
                    </Button>

                    <span className="text-white text-sm font-medium">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 relative">
                    <div className="relative" ref={subtitleMenuRef}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (showSubtitles) {
                            setShowSubtitleMenu(!showSubtitleMenu);
                          } else {
                            setShowSubtitles(true);
                          }
                        }}
                        className={`text-white hover:bg-white/20 ${
                          showSubtitles ? 'bg-white/20' : ''
                        }`}
                        title="Subtítulos"
                      >
                        <Subtitles className="h-5 w-5" />
                      </Button>
                      
                      {showSubtitles && showSubtitleMenu && (
                        <div
                          className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-sm rounded-lg p-2 min-w-[120px] border border-white/10 shadow-xl z-20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-400 mb-1">
                            <Languages className="h-3 w-3" />
                            <span>Idioma</span>
                          </div>
                          <button
                            onClick={() => {
                              setSubtitleLanguage('es');
                              setShowSubtitleMenu(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                              subtitleLanguage === 'es'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            🇪🇸 Español
                          </button>
                          <button
                            onClick={() => {
                              setSubtitleLanguage('en');
                              setShowSubtitleMenu(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                              subtitleLanguage === 'en'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            🇬🇧 English
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </Button>

                      {showVolumeSlider && (
                        <div 
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 p-3 rounded-lg"
                          onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="video-volume-slider"
                            style={{
                              '--volume': `${volumePercent}%`
                            } as React.CSSProperties}
                          />
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                      title="Pantalla completa"
                    >
                      <Maximize className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 bg-zinc-900 flex flex-col max-h-[90vh]">
            {/* Vista Mobile - Sistema de pestañas con Ratings */}
            <div className="lg:hidden flex-1 overflow-y-auto p-6">
              {mobileTab === 'info' && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {video.title}
                  </h2>

                  <div className="flex gap-3 mb-6">
                    <Button 
                      variant="outline"
                      className={`border-gray-600 hover:bg-cyan-300 flex items-center gap-2 transition-all ${
                        isInFavorites ? 'bg-cyan-500/20 border-cyan-500' : ''
                      }`}
                      onClick={handleToggleFavorite}
                      disabled={isLoadingFavorite}
                    >
                      {isLoadingFavorite ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Guardando...
                        </>
                      ) : isInFavorites ? (
                        <>
                          <Check className="h-5 w-5" />
                          En mi lista
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5" />
                          Añadir a favoritos
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-4 mb-6">
                    {video.duration && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Duración:</span>
                        <span className="text-white text-sm font-medium">
                          {formatTime(video.duration)}
                        </span>
                      </div>
                    )}

                    {video.width && video.height && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Resolución:</span>
                        <span className="text-white text-sm font-medium">
                          {video.width} × {video.height}
                        </span>
                      </div>
                    )}

                    {video.user && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Creador:</span>
                        <a 
                          href={video.user.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
                        >
                          {video.user.name}
                        </a>
                      </div>
                    )}
                  </div>

                  {video.tags && video.tags.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-gray-400 text-sm font-semibold">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {video.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-xs text-gray-300 transition-colors cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {mobileTab === 'ratings' && (
                <RatingSection videoLink={video.videoUrl} />
              )}

              {mobileTab === 'comments' && (
                <CommentsSection videoLink={video.videoUrl} />
              )}
            </div>

            {/* Vista Desktop - Flip card */}
            <div className="hidden lg:block flip-card flex-1">
              <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
                {/* FRONT - Video Info */}
                <div className="flip-card-front p-6">
                  <div className="overflow-y-auto h-full">
                    <h2 className="text-2xl font-bold text-white mb-4">
                      {video.title}
                    </h2>

                    <div className="flex gap-3 mb-6">
  <Button 
    variant="outline"
    className={`border-cyan-500 bg-cyan-500/20 hover:bg-cyan-500/40 flex items-center gap-2 transition-all ${
      isInFavorites ? 'bg-cyan-500/40 border-cyan-400' : ''
    }`}
    onClick={handleToggleFavorite}
    disabled={isLoadingFavorite}
  >
    {isLoadingFavorite ? (
      <>
        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        Guardando...
      </>
    ) : isInFavorites ? (
      <>
        <Check className="h-5 w-5" />
        En mi lista
      </>
    ) : (
      <>
        <Plus className="h-5 w-5" />
        Añadir a favoritos
      </>
    )}
  </Button>
</div>

                    {/* Ratings Button */}
                    <Button
                      variant="ghost"
                      className="
                        w-full 
                        bg-transparent hover:bg-yellow-500/10
                        border border-yellow-500/30 hover:border-yellow-500/50
                        text-yellow-400/90 hover:text-yellow-300
                        font-medium
                        flex items-center justify-center gap-2 
                        mb-4 py-3
                        transition-all duration-200
                        cursor-pointer
                      "
                      onClick={() => setShowRatingsDrawer(true)}
                    >
                      <Star className="h-4 w-4" />
                      Ver calificaciones
                    </Button>

                    {/* Comments Button */}
                    <Button
                      variant="ghost"
                      className="
                        w-full 
                        bg-transparent hover:bg-cyan-500/10
                        border border-cyan-500/30 hover:border-cyan-500/50
                        text-cyan-400/90 hover:text-cyan-300
                        font-medium
                        flex items-center justify-center gap-2 
                        mb-6 py-3
                        transition-all duration-200
                        cursor-pointer
                      "
                      onClick={() => setIsFlipped(true)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Ver comentarios
                    </Button>

                    <div className="space-y-4 mb-6">
                      {video.duration && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Duración:</span>
                          <span className="text-white text-sm font-medium">
                            {formatTime(video.duration)}
                          </span>
                        </div>
                      )}

                      {video.width && video.height && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Resolución:</span>
                          <span className="text-white text-sm font-medium">
                            {video.width} × {video.height}
                          </span>
                        </div>
                      )}

                      {video.user && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">Creador:</span>
                          <a 
                            href={video.user.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
                          >
                            {video.user.name}
                          </a>
                        </div>
                      )}
                    </div>

                    {video.tags && video.tags.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-gray-400 text-sm font-semibold">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {video.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-full text-xs text-gray-300 transition-colors cursor-pointer"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* BACK - Comments */}
                <div className="flip-card-back">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFlipped(false)}
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Volver
                    </Button>
                    <h3 className="text-lg font-bold text-white">
                      Comentarios
                    </h3>
                    <div className="w-20" />
                  </div>

                  <div className="overflow-y-auto h-full">
                    <CommentsSection videoLink={video.videoUrl} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings Drawer - Solo Desktop */}
        <div
          className={`hidden lg:block fixed top-0 right-0 h-full w-96 bg-zinc-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
            showRatingsDrawer ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Calificaciones</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRatingsDrawer(false)}
                className="text-gray-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <RatingSection videoLink={video.videoUrl} />
            </div>
          </div>
        </div>

        {/* Overlay para el drawer */}
        {showRatingsDrawer && (
          <div
            className="hidden lg:block fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowRatingsDrawer(false)}
          />
        )}
      </div>
    </div>
  );
};