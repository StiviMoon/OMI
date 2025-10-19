import axios, { AxiosInstance } from 'axios';
import { config } from '../../config';
import {
  PexelsVideo,
  PexelsVideosSearchResponse,
  PexelsPopularVideosResponse,
  SimplifiedVideo,
} from '../../types/pexels.types';

/**
 * Options for searching Pexels videos.
 * 
 * @typedef {Object} SearchVideosOptions
 * @property {string} query - Search query text.
 * @property {number} [page] - Page number for pagination.
 * @property {number} [perPage] - Number of results per page.
 * @property {'landscape'|'portrait'|'square'} [orientation] - Video orientation filter.
 * @property {'large'|'medium'|'small'} [size] - Video size filter.
 * @property {number} [minDuration] - Minimum video duration in seconds.
 * @property {number} [maxDuration] - Maximum video duration in seconds.
 */

/**
 * Options for retrieving popular Pexels videos.
 * 
 * @typedef {Object} GetPopularVideosOptions
 * @property {number} [page] - Page number for pagination.
 * @property {number} [perPage] - Number of results per page.
 * @property {number} [minWidth] - Minimum width of videos.
 * @property {number} [minHeight] - Minimum height of videos.
 * @property {number} [minDuration] - Minimum duration in seconds.
 * @property {number} [maxDuration] - Maximum duration in seconds.
 */

/**
 * Service class that interacts with the Pexels Video API.
 * 
 * This class provides methods to search, fetch, and simplify videos
 * using the Pexels API, making the data easier to use in frontend applications.
 */
export class PexelsService {
  /** Axios instance configured for Pexels API requests. */
  private axiosInstance: AxiosInstance;

  /**
   * Creates an instance of the PexelsService and initializes Axios with authentication headers.
   * 
   * @example
   * const pexelsService = new PexelsService();
   */
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.pexels.com',
      headers: {
        Authorization: config.pexels.apiKey,
      },
    });
  }

  /**
   * Searches for videos on Pexels with optional filters.
   * 
   * @async
   * @param {SearchVideosOptions} options - Search filters and parameters.
   * @returns {Promise<PexelsVideosSearchResponse>} A promise that resolves with the search response.
   * @throws {Error} If the Pexels API request fails.
   * 
   * @example
   * const response = await pexelsService.searchVideos({ query: 'nature', perPage: 10 });
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

      const response = await this.axiosInstance.get<PexelsVideosSearchResponse>('/videos/search', { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Pexels API error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Retrieves popular or curated videos from Pexels with optional filters.
   * 
   * @async
   * @param {GetPopularVideosOptions} [options={}] - Options for filtering and pagination.
   * @returns {Promise<PexelsPopularVideosResponse>} A promise that resolves with the popular videos.
   * @throws {Error} If the Pexels API request fails.
   * 
   * @example
   * const popularVideos = await pexelsService.getPopularVideos({ perPage: 5 });
   */
  async getPopularVideos(options: GetPopularVideosOptions = {}): Promise<PexelsPopularVideosResponse> {
    try {
      const params: Record<string, number> = {
        page: options.page || 1,
        per_page: options.perPage || 15,
      };

      if (options.minWidth) params.min_width = options.minWidth;
      if (options.minHeight) params.min_height = options.minHeight;
      if (options.minDuration) params.min_duration = options.minDuration;
      if (options.maxDuration) params.max_duration = options.maxDuration;

      const response = await this.axiosInstance.get<PexelsPopularVideosResponse>('/videos/popular', { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Pexels API error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Retrieves a specific video by its Pexels ID.
   * 
   * @async
   * @param {number} id - The Pexels video ID.
   * @returns {Promise<PexelsVideo>} A promise that resolves with the video data.
   * @throws {Error} If the video cannot be retrieved.
   * 
   * @example
   * const video = await pexelsService.getVideoById(123456);
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
   * Simplifies a Pexels video object to a more concise format
   * suitable for frontend display.
   * 
   * @param {PexelsVideo} video - The raw video object from Pexels.
   * @returns {SimplifiedVideo} A simplified version of the video object.
   * 
   * @example
   * const simplified = pexelsService.simplifyVideo(video);
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
        .filter(file => file.quality !== 'sd')
        .map(file => ({
          quality: file.quality,
          width: file.width,
          height: file.height,
          link: file.link,
        }))
        .sort((a, b) => b.width - a.width),
    };
  }

  /**
   * Simplifies an array of Pexels videos into lightweight objects.
   * 
   * @param {PexelsVideo[]} videos - Array of raw Pexels video objects.
   * @returns {SimplifiedVideo[]} Array of simplified video objects.
   * 
   * @example
   * const simplifiedList = pexelsService.simplifyVideos(response.videos);
   */
  simplifyVideos(videos: PexelsVideo[]): SimplifiedVideo[] {
    return videos.map(video => this.simplifyVideo(video));
  }
}
