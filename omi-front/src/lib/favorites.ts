'use client';

import { favoritesAPI } from './api/favorites';

export interface FavoriteVideo {
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
  addedAt: number;
}

// Helper to get user ID from localStorage
const getUserId = (): string => {
  if (typeof window === 'undefined') {
    throw new Error('Cannot access window');
  }
  
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('User not authenticated');
  }
  
  const user = JSON.parse(userStr);
  return user.id;
};

export const addToFavorites = async (video: Omit<FavoriteVideo, 'addedAt'>): Promise<boolean> => {
  try {
    const userId = getUserId();
    
    const metadata = {
      title: video.title,
      videoUrl: video.videoUrl,
      posterUrl: video.posterUrl,
      duration: video.duration,
      tags: video.tags,
      user: video.user,
      width: video.width,
      height: video.height,
      addedAt: Date.now(),
    };

    await favoritesAPI.add(userId, video.id, 'video', metadata);
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

export const removeFromFavorites = async (id: string): Promise<boolean> => {
  try {
    const userId = getUserId();
    await favoritesAPI.remove(userId, id);
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

export const isFavorite = async (id: string): Promise<boolean> => {
  try {
    const userId = getUserId();
    return await favoritesAPI.isFavorite(userId, id);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

export const getAllFavorites = async (): Promise<FavoriteVideo[]> => {
  try {
    const userId = getUserId();
    const backendFavorites = await favoritesAPI.list(userId);
    
    // Transform backend favorites to frontend format
    return backendFavorites
      .filter(fav => fav.mediaType === 'video')
      .map(fav => {
        const metadata = fav.metadata as FavoriteVideo | undefined;
        if (metadata) {
          // If we have full metadata, use it
          return {
            ...metadata,
            id: fav.pexelsId,
            addedAt: metadata.addedAt || new Date(fav.createdAt).getTime(),
          };
        }
        
        // Otherwise, return minimal info (shouldn't happen, but fallback)
        return {
          id: fav.pexelsId,
          title: `Video ${fav.pexelsId}`,
          videoUrl: '',
          posterUrl: '',
          addedAt: new Date(fav.createdAt).getTime(),
        };
      })
      .sort((a, b) => b.addedAt - a.addedAt);
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

export const toggleFavorite = async (video: Omit<FavoriteVideo, 'addedAt'>): Promise<boolean> => {
  try {
    const userId = getUserId();
    const isAlreadyFavorite = await favoritesAPI.isFavorite(userId, video.id);
    
    if (isAlreadyFavorite) {
      return await removeFromFavorites(video.id);
    } else {
      return await addToFavorites(video);
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
};
