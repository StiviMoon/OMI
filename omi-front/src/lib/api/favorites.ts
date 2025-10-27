// Favorites API client
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_BASE = `${API_URL}/api/favorites`;

// Helper to get auth headers
const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User not authenticated');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

// Helper to handle responses
const handleResponse = async <T,>(response: Response): Promise<T> => {
  const text = await response.text();
  
  if (!response.ok) {
    let errorMessage = 'Request error';
    try {
      const errorData = JSON.parse(text);
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Server response is not valid JSON');
  }
};

// Backend Favorite interface
export interface BackendFavorite {
  id: string;
  userId: string;
  pexelsId: string;
  mediaType: 'photo' | 'video';
  createdAt: string | Date;
  metadata?: Record<string, unknown>;
}

interface FavoritesListResponse {
  message: string;
  data: BackendFavorite[];
}

interface FavoriteResponse {
  message: string;
  data: BackendFavorite;
}

interface FavoriteStatusResponse {
  message: string;
  data: { isFavorite: boolean };
}

interface AddFavoriteRequest {
  userId: string;
  pexelsId: string;
  mediaType: 'photo' | 'video';
  metadata?: Record<string, unknown>;
}

export const favoritesAPI = {
  /**
   * Get all favorites for a user
   * GET /api/favorites/:userId
   */
  list: async (userId: string): Promise<BackendFavorite[]> => {
    const response = await fetch(`${API_BASE}/${userId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    const data = await handleResponse<FavoritesListResponse>(response);
    return data.data;
  },

  /**
   * Add a video to favorites
   * POST /api/favorites
   */
  add: async (userId: string, pexelsId: string, mediaType: 'photo' | 'video', metadata?: Record<string, unknown>): Promise<BackendFavorite> => {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ userId, pexelsId, mediaType, metadata } as AddFavoriteRequest),
    });

    const data = await handleResponse<FavoriteResponse>(response);
    return data.data;
  },

  /**
   * Remove a video from favorites
   * DELETE /api/favorites/:userId/:pexelsId
   */
  remove: async (userId: string, pexelsId: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE}/${userId}/${pexelsId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    await handleResponse<{ message: string }>(response);
    return true;
  },

  /**
   * Check if a video is favorited
   * GET /api/favorites/:userId/:pexelsId/status
   */
  isFavorite: async (userId: string, pexelsId: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE}/${userId}/${pexelsId}/status`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    const data = await handleResponse<FavoriteStatusResponse>(response);
    return data.data.isFavorite;
  },
};

