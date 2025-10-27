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

export class PexelsService {
  private axiosInstance: AxiosInstance;

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
   * Search for videos with optional filters
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
   * Get popular/curated videos with optional filters
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
   * Get a specific video by ID
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
   * Simplify video data for frontend consumption
   * Returns only the most relevant information
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
   * Simplify multiple videos
   */
  simplifyVideos(videos: PexelsVideo[]): SimplifiedVideo[] {
    return videos.map(video => this.simplifyVideo(video));
  }
}

