'use client';

import React, { useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  onAddToList?: (id: string) => void;
  isInList?: boolean;
}

export const VideoModal: React.FC<VideoModalProps> = ({ 
  isOpen, 
  onClose, 
  video,
  onAddToList,
  isInList = false
}) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-6xl mx-4 bg-zinc-900 rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="flex flex-col lg:flex-row max-h-[90vh]">
          {/* Video Player Section */}
          <div className="lg:w-2/3 bg-black">
            <div className="relative aspect-video">
              <video
                src={video.videoUrl}
                poster={video.posterUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:w-1/3 bg-zinc-900 flex flex-col max-h-[90vh]">
            <div className="p-6 overflow-y-auto flex-1">
              {/* Title */}
              <h2 className="text-2xl font-bold text-white mb-4">
                {video.title}
              </h2>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                
                <Button 
                  variant="outline"
                  className="border-gray-600 hover:bg-cyan-300 flex items-center gap-2"
                  onClick={() => onAddToList?.(video.id)}
                >
                  {isInList ? (
                    <>
                      <Check className="h-5 w-5" />
                      En mi lista
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Añadir
                    </>
                  )}
                </Button>
              </div>

              {/* Video Stats */}
              <div className="space-y-4 mb-6">
                {video.duration && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Duración:</span>
                    <span className="text-white text-sm font-medium">
                      {formatDuration(video.duration)}
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

              {/* Tags */}
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
        </div>
      </div>
    </div>
  );
};