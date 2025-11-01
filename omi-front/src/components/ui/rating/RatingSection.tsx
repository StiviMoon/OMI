'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ratingsAPI, RatingStats, BackendRating } from '@/lib/api/ratings';
import { useAuthContext } from '@/lib/context/AuthContext';

interface RatingSectionProps {
  videoLink: string;
}

export const RatingSection: React.FC<RatingSectionProps> = ({ videoLink }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [userRating, setUserRating] = useState<BackendRating | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRatings();
  }, [videoLink, isAuthenticated]);

  const loadRatings = async () => {
    try {
      setLoading(true);
      
      // Load stats (public)
      const statsData = await ratingsAPI.getStats(videoLink);
      setStats(statsData);

      // Load user rating if authenticated
      if (isAuthenticated) {
        try {
          const userRatingData = await ratingsAPI.getUserRating(videoLink);
          setUserRating(userRatingData);
        } catch (error) {
          // User might not have rated yet
          setUserRating(null);
        }
      }
    } catch (error) {
      console.error('Error loading ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (score: number) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para calificar');
      return;
    }

    try {
      setSubmitting(true);
      const rating = await ratingsAPI.addOrUpdate(videoLink, score);
      setUserRating(rating);
      
      // Reload stats to get updated values
      const statsData = await ratingsAPI.getStats(videoLink);
      setStats(statsData);
    } catch (error) {
      console.error('Error rating video:', error);
      alert('Error al calificar el video. Por favor, intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!userRating) return;
    if (!confirm('¿Estás seguro de eliminar tu calificación?')) return;

    try {
      await ratingsAPI.delete(userRating.id);
      setUserRating(null);
      
      // Reload stats
      const statsData = await ratingsAPI.getStats(videoLink);
      setStats(statsData);
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert('Error al eliminar la calificación.');
    }
  };

  const renderStars = (interactive: boolean = false) => {
    const currentRating = interactive ? (hoveredStar || userRating?.score || 0) : (stats?.averageRating || 0);
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= Math.round(currentRating);
          const isPartiallyFilled = !isFilled && star - 1 < currentRating && currentRating < star;
          
          return (
            <button
              key={star}
              onClick={() => interactive && !submitting && handleRate(star)}
              onMouseEnter={() => interactive && setHoveredStar(star)}
              onMouseLeave={() => interactive && setHoveredStar(0)}
              disabled={!interactive || submitting}
              className={`
                transition-all duration-200
                ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                ${submitting ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  isFilled || isPartiallyFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                }`}
              />
            </button>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mt-6 border-t border-gray-700 pt-6">
        <div className="text-center py-4">
          <div className="h-6 w-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 mt-2 text-sm">Cargando calificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-gray-700 pt-6">
      <div className="space-y-4">
        {/* Average Rating Display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">Calificación</h3>
              {stats && stats.totalRatings > 0 && (
                <span className="text-sm text-gray-400">
                  ({stats.totalRatings} {stats.totalRatings === 1 ? 'voto' : 'votos'})
                </span>
              )}
            </div>
            {stats && stats.totalRatings > 0 ? (
              <div className="flex items-center gap-2 mt-2">
                {renderStars(false)}
                <span className="text-2xl font-bold text-white ml-2">
                  {stats.averageRating.toFixed(1)}
                </span>
              </div>
            ) : (
              <p className="text-gray-400 text-sm mt-2">
                No hay calificaciones aún
              </p>
            )}
          </div>
        </div>

        {/* Rating Distribution */}
        {stats && stats.totalRatings > 0 && (
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star as keyof typeof stats.distribution];
              const percentage = (count / stats.totalRatings) * 100;
              
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400 w-8">{star}★</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-400 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* User Rating Section */}
        <div className="border-t border-gray-700 pt-4">
          {isAuthenticated ? (
            <div>
              <p className="text-sm text-gray-400 mb-2">
                {userRating ? 'Tu calificación:' : 'Califica este video:'}
              </p>
              <div className="flex items-center gap-4">
                {renderStars(true)}
                {userRating && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDeleteRating}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    Eliminar calificación
                  </Button>
                )}
              </div>
              {userRating && (
                <p className="text-xs text-gray-500 mt-2">
                  Calificaste con {userRating.score} {userRating.score === 1 ? 'estrella' : 'estrellas'}
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 bg-zinc-800 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm text-center">
                Inicia sesión para calificar este video
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};