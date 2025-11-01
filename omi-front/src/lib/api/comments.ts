// Comments API client
// In Next.js, NEXT_PUBLIC_ variables are available in client components
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_BASE = `${API_URL}/api/comments`;

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

// Backend Comment interface
export interface BackendComment {
  id: string;
  userId: string;
  videoLink: string;
  content: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

interface CommentsListResponse {
  message: string;
  data: BackendComment[];
}

interface CommentResponse {
  message: string;
  data: BackendComment;
}

interface AddCommentRequest {
  videoLink: string;
  content: string;
}

interface UpdateCommentRequest {
  content: string;
}

export const commentsAPI = {
  /**
   * Get all comments for a video
   * GET /api/comments/video?videoLink=...
   */
  list: async (videoLink: string): Promise<BackendComment[]> => {
    const encodedLink = encodeURIComponent(videoLink);
    const url = `${API_BASE}/video?videoLink=${encodedLink}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await handleResponse<CommentsListResponse>(response);
    return data.data;
  },

  /**
   * Add a comment to a video
   * POST /api/comments
   */
  add: async (videoLink: string, content: string): Promise<BackendComment> => {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ videoLink, content } as AddCommentRequest),
    });

    const data = await handleResponse<CommentResponse>(response);
    return data.data;
  },

  /**
   * Update a comment
   * PUT /api/comments/:commentId
   */
  update: async (commentId: string, content: string): Promise<BackendComment> => {
    const response = await fetch(`${API_BASE}/${commentId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ content } as UpdateCommentRequest),
    });

    const data = await handleResponse<CommentResponse>(response);
    return data.data;
  },

  /**
   * Delete a comment
   * DELETE /api/comments/:commentId
   */
  delete: async (commentId: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE}/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    await handleResponse<{ message: string }>(response);
    return true;
  },
};

