import { Movie, SearchParams, PopularParams } from '../types';

/**
 * Base URL for backend API requests.
 * Automatically uses environment variable if defined, otherwise defaults to localhost.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/videos`
  : 'http://localhost:3001/api/videos';

/* ===========================
   🧩 Internal Types (Backend)
=========================== */

/** Represents a video file from the backend API. */
interface VideoFile {
  quality: string;
  width: number;
  height: number;
  link: string;
}

/** Represents the creator or uploader of a video. */
interface VideoUser {
  name: string;
  url: string;
}

/** Raw video object returned by the backend. */
interface Video {
  id: number;
  width: number;
  height: number;
  duration: number;
  tags: string[];
  url: string;
  thumbnail: string;
  user: VideoUser;
  files: VideoFile[];
}

/** Generic paginated backend response for multiple videos. */
interface BackendResponse {
  success: boolean;
  data: {
    page: number;
    perPage: number;
    totalResults: number;
    hasMore: boolean;
    videos: Video[];
  };
}

/** Response format for a single video by ID. */
interface SingleVideoResponse {
  success: boolean;
  data: {
    video: Video;
  };
}

/* ===========================
   🧮 Utility Functions
=========================== */

/**
 * Builds a URL query string from a parameter object.
 * Filters out undefined or null values.
 *
 * @param {Record<string, string | number | boolean | undefined | null>} params - Object containing key/value pairs.
 * @returns {string} Encoded query string.
 */
function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });
  return query.toString();
}

/**
 * Performs a fetch request to the backend API with error handling and logging.
 *
 * @template T
 * @param {string} endpoint - API endpoint (e.g., `/search`, `/popular`).
 * @param {Record<string, string | number | boolean | undefined | null>} [params] - Optional query parameters.
 * @returns {Promise<T>} Parsed JSON response from the server.
 * @throws Will throw an error if the request fails or returns invalid JSON.
 */
async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>
): Promise<T> {
  const queryString = params ? `?${buildQueryString(params)}` : '';
  const url = `${API_BASE_URL}${endpoint}${queryString}`;

  console.log('🔍 Fetching URL:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const responseText = await response.text();
    console.log('📦 Raw Response:', responseText.substring(0, 200));

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }

      console.error('❌ API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });

      throw new Error(errorData.message || errorData.error || `API Error: ${response.status}`);
    }

    const jsonData = JSON.parse(responseText);
    return jsonData;
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    throw error;
  }
}

/**
 * Transforms a raw backend video object into the internal {@link Movie} model used by the frontend.
 *
 * @param {Video} video - Raw backend video object.
 * @returns {Movie} Transformed frontend-friendly movie object.
 */
function transformVideo(video: Video): Movie {
  const title = video.tags?.length
    ? video.tags.slice(0, 3).join(' • ')
    : `Video by ${video.user?.name || 'Unknown'}`;

  const hdFile = video.files?.find(f => f.quality === 'hd')
    || video.files?.find(f => f.quality === 'sd')
    || video.files?.[0];

  return {
    id: String(video.id),
    title: title.charAt(0).toUpperCase() + title.slice(1),
    posterUrl: video.thumbnail || 'https://via.placeholder.com/400x600?text=No+Image',
    duration: video.duration || 0,
    tags: video.tags || [],
    videoUrl: hdFile?.link || video.url || '',
    user: video.user || { name: 'Unknown', url: '' },
    width: video.width || 1920,
    height: video.height || 1080,
  };
}

/* ===========================
   🎬 Video API Service
=========================== */

/**
 * Centralized API client for fetching videos from the backend.
 * Provides endpoints for search, popular, category, and single video retrieval.
 */
export const videosAPI = {
  /**
   * Searches videos using query parameters.
   *
   * @async
   * @param {SearchParams} params - Search filters such as query, orientation, size, etc.
   * @returns {Promise<Movie[]>} Array of movies matching the search criteria.
   */
  async search(params: SearchParams): Promise<Movie[]> {
    try {
      console.log('🔎 Searching videos with params:', params);
      const data = await fetchAPI<BackendResponse>('/search', params as any);

      if (!data?.success || !data.data?.videos) return [];
      return data.data.videos.map(transformVideo);
    } catch (error) {
      console.error('❌ Error searching videos:', error);
      return [];
    }
  },

  /**
   * Retrieves a list of popular videos.
   *
   * @async
   * @param {PopularParams} [params] - Optional pagination and filter parameters.
   * @returns {Promise<Movie[]>} Array of popular movies.
   */
  async getPopular(params?: PopularParams): Promise<Movie[]> {
    try {
      const data = await fetchAPI<BackendResponse>('/popular', params as any);
      if (!data?.success || !data.data?.videos) return [];
      return data.data.videos.map(transformVideo);
    } catch (error) {
      console.error('❌ Error fetching popular videos:', error);
      return [];
    }
  },

  /**
   * Retrieves a single video by its ID.
   *
   * @async
   * @param {string} id - Video identifier.
   * @returns {Promise<Movie | null>} Video data or null if not found.
   */
  async getById(id: string): Promise<Movie | null> {
    try {
      const data = await fetchAPI<SingleVideoResponse>(`/${id}`);
      if (!data?.success || !data.data?.video) return null;
      return transformVideo(data.data.video);
    } catch (error) {
      console.error(`❌ Error fetching video ${id}:`, error);
      return null;
    }
  },

  /**
   * Retrieves videos belonging to a given category.
   *
   * @async
   * @param {string} category - Category name (e.g., "nature", "technology").
   * @param {number} [perPage=15] - Number of results to fetch.
   * @returns {Promise<Movie[]>} Array of movies within the category.
   */
  async getByCategory(category: string, perPage = 15): Promise<Movie[]> {
    return this.search({ query: category, per_page: perPage });
  },

  /**
   * Retrieves a single "featured" video for the hero banner.
   *
   * @async
   * @returns {Promise<{
   *   title: string;
   *   description: string;
   *   backdropUrl: string;
   *   videoUrl?: string;
   * } | null>} Featured video metadata or null if unavailable.
   */
  async getFeatured(): Promise<{
    title: string;
    description: string;
    backdropUrl: string;
    videoUrl?: string;
  } | null> {
    try {
      const data = await fetchAPI<BackendResponse>('/popular', { per_page: 1 });

      if (!data?.success || !data.data?.videos?.length) return null;
      const video = data.data.videos[0];
      const hdFile = video.files?.find(f => f.quality === 'hd') || video.files?.[0];

      return {
        title: video.tags?.[0]
          ? video.tags[0].charAt(0).toUpperCase() + video.tags[0].slice(1)
          : 'Video Destacado',
        description: video.tags?.length
          ? `Un increíble video de ${video.tags.slice(0, 3).join(', ')} por ${video.user?.name || 'Unknown'}. Duración: ${Math.floor(video.duration || 0)}s`
          : `Video por ${video.user?.name || 'Unknown'}`,
        backdropUrl: video.thumbnail,
        videoUrl: hdFile?.link,
      };
    } catch (error) {
      console.error('❌ Error fetching featured video:', error);
      return null;
    }
  },
};
