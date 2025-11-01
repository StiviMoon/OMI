// Ratings API client
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_BASE = `${API_URL}/api/ratings`;

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

// Backend Rating interfaces
export interface BackendRating {
  id: string;
  userId: string;
  videoLink: string;
  score: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface RatingStatsResponse {
  message: string;
  data: RatingStats;
}

interface UserRatingResponse {
  message: string;
  data: BackendRating | null;
}

interface AddOrUpdateRatingResponse {
  message: string;
  data: BackendRating;
}

interface AddOrUpdateRatingRequest {
  videoLink: string;
  score: number;
}

export const ratingsAPI = {
  /**
   * Get rating statistics for a video
   * GET /api/ratings/stats?videoLink=...
   */
  getStats: async (videoLink: string): Promise<RatingStats> => {
    const encodedLink = encodeURIComponent(videoLink);
    const url = `${API_BASE}/stats?videoLink=${encodedLink}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse<RatingStatsResponse>(response);
    return data.data;
  },

  /**
   * Get user's rating for a video
   * GET /api/ratings/user?videoLink=...
   */
  getUserRating: async (videoLink: string): Promise<BackendRating | null> => {
    const encodedLink = encodeURIComponent(videoLink);
    const url = `${API_BASE}/user?videoLink=${encodedLink}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    const data = await handleResponse<UserRatingResponse>(response);
    return data.data;
  },

  /**
   * Add or update a rating for a video
   * POST /api/ratings
   */
  addOrUpdate: async (videoLink: string, score: number): Promise<BackendRating> => {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ videoLink, score } as AddOrUpdateRatingRequest),
    });

    const data = await handleResponse<AddOrUpdateRatingResponse>(response);
    return data.data;
  },

  /**
   * Delete user's rating
   * DELETE /api/ratings/:ratingId
   */
  delete: async (ratingId: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE}/${ratingId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    await handleResponse<{ message: string }>(response);
    return true;
  },
};