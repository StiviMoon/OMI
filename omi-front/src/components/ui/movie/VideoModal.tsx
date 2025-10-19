'use client';

import React, { useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Props for the {@link VideoModal} component.
 * 
 * @interface VideoModalProps
 */
interface VideoModalProps {
  /** Determines whether the modal is currently visible. */
  isOpen: boolean;
  /** Callback function to close the modal. */
  onClose: () => void;
  /** The video data to be displayed in the modal. */
  video: {
    /** Unique identifier for the video. */
    id: string;
    /** Title of the video. */
    title: string;
    /** URL of the video file for playback. */
    videoUrl: string;
    /** Poster image displayed before playback starts. */
    posterUrl: string;
    /** Optional duration in seconds. */
    duration?: number;
    /** Optional tags or categories for the video. */
    tags?: string[];
    /** Optional information about the creator/uploader. */
    user?: {
      name: string;
      url: string;
    };
    /** Optional width of the video in pixels. */
    width?: number;
    /** Optional height of the video in pixels. */
    height?: number;
  };
  /** Optional callback when the video is added/removed from the user’s list. */
  onAddToList?: (id: string) => void;
  /** Whether the video is already included in the user’s favorites list. */
  isInList?: boolean;
}

/**
 * Modal component for video playback and metadata display.
 * 
 * This component handles:
 * - Video playback with built-in HTML5 `<video>` controls.
 * - Dynamic information such as duration, resolution, and tags.
 * - Adding/removing videos from the user’s list.
 * - Closing the modal via the ESC key or backdrop click.
 * 
 * Accessibility and UX features:
 * - Disables body scrolling while open.
 * - Automatically restores scroll and event listeners on unmount.
 * - Fully keyboard-accessible (ESC key support).
 * 
 * @component
 * @example
 * <VideoModal
 *   isOpen={true}
 *   onClose={() => console.log('Closed')}
 *   video={{
 *     id: '1',
 *     title: 'Ocean Dreams',
 *     videoUrl: '/videos/ocean.mp4',
 *     posterUrl: '/images/ocean.jpg',
 *     duration: 180,
 *     tags: ['nature', 'relaxing']
 *   }}
 *   onAddToList={(id) => console.log('Added to list:', id)}
 *   isInList={false}
 * />
 * 
 * @param {VideoModalProps} props - Component props.
 * @returns {JSX.Element | null} The video modal component.
 */
export const VideoModal: React.FC<VideoModalProps> = ({ 
  isOpen, 
  onClose, 
  video,
  onAddToList,
  isInList = false
}) => {
  // ======= ESCAPE KEY HANDLER =======
  /**
   * Closes the modal when the ESC key is pressed and prevents background scroll.
   */
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

  // ======= HELPER FUNCTION =======
  /**
   * Converts video duration from seconds to `mm:ss` format.
   * 
   * @param {number} seconds - Duration in seconds.
   * @returns {string} Formatted duration.
   */
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ======= RENDER =======
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* ======= BACKDROP ======= */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* ======= MODAL CONTAINER ======= */}
      <div className="relative w-full max-w-6xl mx-4 bg-zinc-900 rounded-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
          onClick={onClose}
          aria-label="Close video modal"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="flex flex-col lg:flex-row max-h-[90vh]">
          {/* ======= VIDEO PLAYER SECTION ======= */}
          <div className="lg:w-2/3 bg-black">
            <div className="relative aspect-video">
              <video
                src={video.videoUrl}
                poster={video.posterUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support the video element.
              </video>
            </div>
          </div>

          {/* ======= INFO SECTION ======= */}
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
                      In My List
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Add to List
                    </>
                  )}
                </Button>
              </div>

              {/* Video Metadata */}
              <div className="space-y-4 mb-6">
                {video.duration && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Duration:</span>
                    <span className="text-white text-sm font-medium">
                      {formatDuration(video.duration)}
                    </span>
                  </div>
                )}

                {video.width && video.height && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Resolution:</span>
                    <span className="text-white text-sm font-medium">
                      {video.width} × {video.height}
                    </span>
                  </div>
                )}

                {video.user && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Creator:</span>
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
