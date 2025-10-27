'use client';

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

export const addToFavorites = async (video: Omit<FavoriteVideo, 'addedAt'>): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    const favoriteData: FavoriteVideo = {
      ...video,
      addedAt: Date.now()
    };
    
    // ✅ Usar localStorage en lugar de window.storage
    localStorage.setItem(`favorite:${video.id}`, JSON.stringify(favoriteData));
    return true;
  } catch {
    console.error('Error adding to favorites');
    return false;
  }
};

export const removeFromFavorites = async (id: string): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    // ✅ Usar localStorage
    localStorage.removeItem(`favorite:${id}`);
    return true;
  } catch {
    console.error('Error removing from favorites');
    return false;
  }
};

export const isFavorite = async (id: string): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    // ✅ Usar localStorage
    const item = localStorage.getItem(`favorite:${id}`);
    return item !== null;
  } catch {
    return false;
  }
};

// ✅ Obtener todos los favoritos usando localStorage
export const getAllFavorites = async (): Promise<FavoriteVideo[]> => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }

    const favorites: FavoriteVideo[] = [];
    
    // Iterar sobre todas las keys de localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Solo procesar keys que empiecen con 'favorite:'
      if (key && key.startsWith('favorite:')) {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const video = JSON.parse(item) as FavoriteVideo;
            favorites.push(video);
          }
        } catch {
          console.error(`Error loading favorite ${key}`);
        }
      }
    }

    // Ordenar por fecha de agregado (más recientes primero)
    return favorites.sort((a, b) => b.addedAt - a.addedAt);
  } catch {
    console.error('Error loading favorites');
    return [];
  }
};

// Toggle favorito (agregar o remover)
export const toggleFavorite = async (video: Omit<FavoriteVideo, 'addedAt'>): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') {
      return false;
    }

    const isAlreadyFavorite = await isFavorite(video.id);
    
    if (isAlreadyFavorite) {
      return await removeFromFavorites(video.id);
    } else {
      return await addToFavorites(video);
    }
  } catch {
    console.error('Error toggling favorite');
    return false;
  }
};