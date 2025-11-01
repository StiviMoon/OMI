import axios, { AxiosInstance } from 'axios';
import { config } from '../../config';
import {
  PexelsVideo,
  PexelsVideosSearchResponse,
  PexelsPopularVideosResponse,
  SimplifiedVideo,
} from '../../types/pexels.types';

export interface SearchVideosOptions {
  query: string;
  page?: number;
  perPage?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  size?: 'large' | 'medium' | 'small';
  minDuration?: number;
  maxDuration?: number;
}

export interface GetPopularVideosOptions {
  page?: number;
  perPage?: number;
  minWidth?: number;
  minHeight?: number;
  minDuration?: number;
  maxDuration?: number;
}

/**
 * Service for interacting with Pexels Video API
 * 
 * Provides methods to search, retrieve popular videos, and get video details
 * from the Pexels platform. Handles API errors, rate limiting, and response
 * simplification for frontend consumption.
 * 
 * @class PexelsService
 * 
 * @example
 * ```typescript
 * const pexelsService = new PexelsService();
 * 
 * // Search videos
 * const results = await pexelsService.searchVideos({
 *   query: 'ocean',
 *   page: 1,
 *   perPage: 20,
 *   orientation: 'landscape'
 * });
 * 
 * // Get popular videos
 * const popular = await pexelsService.getPopularVideos({
 *   page: 1,
 *   perPage: 15
 * });
 * ```
 */
export class PexelsService {
  private axiosInstance: AxiosInstance;

  /**
   * Creates an instance of PexelsService
   * 
   * Initializes Axios instance with Pexels API base URL and authorization header.
   * Logs warning if API key is missing from environment variables.
   * 
   * @constructor
   */
  constructor() {
    if (!config.pexels.apiKey) {
      console.error('⚠️  PEXELS_API_KEY is missing in environment variables');
    }
    
    this.axiosInstance = axios.create({
      baseURL: 'https://api.pexels.com',
      headers: {
        Authorization: config.pexels.apiKey || '',
      },
    });
  }

  /**
   * Searches for videos on Pexels with optional filters
   * 
   * Supports filtering by:
   * - Orientation (landscape, portrait, square)
   * - Size (large, medium, small)
   * - Duration range (min/max in seconds)
   * 
   * Rate limits:
   * - Free plan: 200 requests/hour
   * - Maximum results per page: 80
   * 
   * @method searchVideos
   * @async
   * @param {SearchVideosOptions} options - Search options
   * @param {string} options.query - Search query (required)
   * @param {number} [options.page=1] - Page number (default: 1)
   * @param {number} [options.perPage=15] - Results per page (1-80, default: 15)
   * @param {'landscape'|'portrait'|'square'} [options.orientation] - Video orientation filter
   * @param {'large'|'medium'|'small'} [options.size] - Video size filter
   * @param {number} [options.minDuration] - Minimum duration in seconds
   * @param {number} [options.maxDuration] - Maximum duration in seconds
   * @returns {Promise<PexelsVideosSearchResponse>} Response with video search results
   * @throws {Error} If API request fails or rate limit is exceeded
   * 
   * @example
   * ```typescript
   * // Basic search
   * const results = await pexelsService.searchVideos({
   *   query: 'nature'
   * });
   * 
   * // Advanced search with filters
   * const filtered = await pexelsService.searchVideos({
   *   query: 'ocean',
   *   page: 1,
   *   perPage: 20,
   *   orientation: 'landscape',
   *   minDuration: 10,
   *   maxDuration: 30
   * });
   * ```
   */
  async searchVideos(options: SearchVideosOptions): Promise<PexelsVideosSearchResponse> {
    try {
      const params: Record<string, string | number> = {
        query: options.query,
        page: options.page || 1,
        per_page: options.perPage || 15,
      };

      if (options.orientation) params.orientation = options.orientation;
      if (options.size) params.size = options.size;
      if (options.minDuration) params.min_duration = options.minDuration;
      if (options.maxDuration) params.max_duration = options.maxDuration;

      const response = await this.axiosInstance.get<PexelsVideosSearchResponse>('/videos/search', {
        params,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Pexels API error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Retrieves popular/curated videos from Pexels with optional filters
   * 
   * Returns hand-picked high-quality videos from Pexels.
   * Supports filtering by dimensions and duration.
   * 
   * Rate limits:
   * - Free plan: 200 requests/hour
   * - Maximum results per page: 80
   * 
   * @method getPopularVideos
   * @async
   * @param {GetPopularVideosOptions} [options={}] - Filter options
   * @param {number} [options.page=1] - Page number (default: 1)
   * @param {number} [options.perPage=15] - Results per page (1-80, default: 15)
   * @param {number} [options.minWidth] - Minimum width in pixels (e.g., 1920 for Full HD)
   * @param {number} [options.minHeight] - Minimum height in pixels (e.g., 1080 for Full HD)
   * @param {number} [options.minDuration] - Minimum duration in seconds
   * @param {number} [options.maxDuration] - Maximum duration in seconds
   * @returns {Promise<PexelsPopularVideosResponse>} Response with popular videos
   * @throws {Error} If API key is not configured
   * @throws {Error} If API request fails or rate limit (429) is exceeded
   * 
   * @example
   * ```typescript
   * // Get basic popular videos
   * const popular = await pexelsService.getPopularVideos();
   * 
   * // Get Full HD popular videos
   * const hdVideos = await pexelsService.getPopularVideos({
   *   page: 1,
   *   perPage: 20,
   *   minWidth: 1920,
   *   minHeight: 1080
   * });
   * ```
   */
  async getPopularVideos(options: GetPopularVideosOptions = {}): Promise<PexelsPopularVideosResponse> {
    try {
      if (!config.pexels.apiKey) {
        throw new Error('Pexels API key is not configured');
      }

      const params: Record<string, number> = {
        page: options.page || 1,
        per_page: options.perPage || 15,
      };

      if (options.minWidth) params['min_width'] = options.minWidth;
      if (options.minHeight) params['min_height'] = options.minHeight;
      if (options.minDuration) params['min_duration'] = options.minDuration;
      if (options.maxDuration) params['max_duration'] = options.maxDuration;

      const response = await this.axiosInstance.get<PexelsPopularVideosResponse>('/videos/popular', {
        params,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.error || error.message;
        
        if (status === 429) {
          console.error('⚠️  Pexels API Rate Limit Exceeded - 429');
          throw new Error('API rate limit exceeded. Please wait a moment before trying again.');
        }
        
        console.error('Pexels API Error:', {
          status,
          data: error.response?.data,
          message: errorMessage,
        });
        throw new Error(`Pexels API error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Retrieves a specific video by its Pexels ID
   * 
   * Returns complete video information including all available qualities,
   * metadata, and user information.
   * 
   * @method getVideoById
   * @async
   * @param {number} id - Pexels video ID
   * @returns {Promise<PexelsVideo>} Complete video object with all details
   * @throws {Error} If video ID is invalid or not found
   * @throws {Error} If API request fails
   * 
   * @example
   * ```typescript
   * const video = await pexelsService.getVideoById(123456);
   * console.log(video.url); // Video page URL
   * console.log(video.video_files); // Available video files
   * ```
   */
  async getVideoById(id: number): Promise<PexelsVideo> {
    try {
      const response = await this.axiosInstance.get<PexelsVideo>(`/videos/videos/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Pexels API error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Simplifies video data structure for frontend consumption
   * 
   * Transforms complex Pexels video object into a simplified format by:
   * - Extracting only essential fields
   * - Filtering out SD quality videos
   * - Sorting video files by quality (highest first)
   * - Normalizing user information
   * 
   * @method simplifyVideo
   * @param {PexelsVideo} video - Complete Pexels video object
   * @returns {SimplifiedVideo} Simplified video object with essential data
   * 
   * @example
   * ```typescript
   * const pexelsVideo = await pexelsService.getVideoById(123456);
   * const simplified = pexelsService.simplifyVideo(pexelsVideo);
   * 
   * // simplified contains: id, width, height, duration, tags, url, thumbnail, user, files
   * console.log(simplified.files[0].link); // HD video URL
   * ```
   */
  simplifyVideo(video: PexelsVideo): SimplifiedVideo {
    return {
      id: video.id,
      width: video.width,
      height: video.height,
      duration: video.duration,
      tags: video.tags,
      url: video.url,
      thumbnail: video.image,
      user: {
        name: video.user.name,
        url: video.user.url,
      },
      files: video.video_files
        .filter(file => file.quality !== 'sd') // Filter out SD quality
        .map(file => ({
          quality: file.quality,
          width: file.width,
          height: file.height,
          link: file.link,
        }))
        .sort((a, b) => b.width - a.width), // Sort by quality (descending)
    };
  }

  /**
   * Simplifies multiple videos at once
   * 
   * Applies simplification to each video in the array.
   * Useful for processing search results or popular videos.
   * 
   * @method simplifyVideos
   * @param {PexelsVideo[]} videos - Array of Pexels video objects
   * @returns {SimplifiedVideo[]} Array of simplified video objects
   * 
   * @example
   * ```typescript
   * const searchResults = await pexelsService.searchVideos({ query: 'nature' });
   * const simplified = pexelsService.simplifyVideos(searchResults.videos);
   * 
   * // Now you can easily iterate over simplified videos
   * simplified.forEach(video => {
   *   console.log(video.id, video.thumbnail);
   * });
   * ```
   */
  simplifyVideos(videos: PexelsVideo[]): SimplifiedVideo[] {
    return videos.map(video => this.simplifyVideo(video));
  }
}

