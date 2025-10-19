
/**
 * Represents the quality levels available for Pexels videos.
 * 
 * @typedef {'hd' | 'sd' | 'uhd' | '4k'} VideoQuality
 */
export type VideoQuality = 'hd' | 'sd' | 'uhd' | '4k';

/**
 * Supported MIME types for Pexels video files.
 * 
 * @typedef {'video/mp4' | 'video/webm' | 'video/ogg'} VideoFileType
 */
export type VideoFileType = 'video/mp4' | 'video/webm' | 'video/ogg';

/**
 * Represents an individual downloadable video file from Pexels.
 * 
 * Each video may include multiple file formats and quality variants.
 * 
 * @interface
 */
export interface VideoFile {
  /** Unique identifier of the video file. */
  id: number;
  /** Video quality (e.g., 'hd', '4k'). */
  quality: VideoQuality;
  /** MIME type of the video file. */
  file_type: VideoFileType;
  /** Width of the video in pixels. */
  width: number;
  /** Height of the video in pixels. */
  height: number;
  /** Frame rate per second. */
  fps: number;
  /** Direct URL to the video file. */
  link: string;
}

/**
 * Represents a thumbnail or preview frame of a video.
 * 
 * @interface
 */
export interface VideoPicture {
  /** Thumbnail identifier. */
  id: number;
  /** URL to the image resource. */
  picture: string;
  /** Frame sequence number. */
  nr: number;
}

/**
 * Represents the Pexels user who uploaded or owns the video.
 * 
 * @interface
 */
export interface VideoUser {
  /** User identifier. */
  id: number;
  /** Full name of the user. */
  name: string;
  /** URL to the user's Pexels profile. */
  url: string;
}

/**
 * Main Pexels video entity returned by the API.
 * 
 * @interface
 */
export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  full_res: null | string;
  tags: string[];
  url: string;
  image: string;
  avg_color: null | string;
  user: VideoUser;
  video_files: VideoFile[];
  video_pictures: VideoPicture[];
}

/**
 * Represents the response structure when searching for videos via the Pexels API.
 * 
 * @interface
 */
export interface PexelsVideosSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: PexelsVideo[];
  next_page?: string;
  prev_page?: string;
}

/**
 * Represents the response structure when fetching popular or curated videos.
 * 
 * @interface
 */
export interface PexelsPopularVideosResponse {
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: PexelsVideo[];
  next_page?: string;
  prev_page?: string;
}

/**
 * Generic wrapper for Pexels API responses.
 * 
 * Used to maintain consistent structure across different endpoints.
 * 
 * @template T
 * @interface
 */
export interface PexelsApiResponse<T = unknown> {
  /** Indicates whether the request was successful. */
  success: boolean;
  /** Response data, if available. */
  data?: T;
  /** Optional success or informational message. */
  message?: string;
  /** Error message, if applicable. */
  error?: string;
}

/**
 * Simplified video structure for frontend use.
 * 
 * Reduces payload size and focuses on key fields required by the UI.
 * 
 * @interface
 */
export interface SimplifiedVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  tags: string[];
  url: string;
  thumbnail: string;
  user: {
    /** Video uploader's name. */
    name: string;
    /** URL to uploader's profile. */
    url: string;
  };
  /** List of available video files sorted by quality. */
  files: SimplifiedVideoFile[];
}

/**
 * Represents a simplified version of a video file for frontend rendering.
 * 
 * @interface
 */
export interface SimplifiedVideoFile {
  quality: VideoQuality;
  width: number;
  height: number;
  link: string;
}

/**
 * Response format for lists of videos in frontend consumption.
 * 
 * @interface
 */
export interface VideoListResponse {
  page: number;
  perPage: number;
  totalResults: number;
  videos: SimplifiedVideo[];
  hasMore: boolean;
}

/**
 * Response format for a single video view in frontend.
 * 
 * @interface
 */
export interface SingleVideoResponse {
  video: SimplifiedVideo;
}

/**
 * Supported orientation filters for Pexels video queries.
 * 
 * @typedef {'landscape' | 'portrait' | 'square'} VideoOrientation
 */
export type VideoOrientation = 'landscape' | 'portrait' | 'square';

/**
 * Supported video size filters for Pexels API.
 * 
 * @typedef {'large' | 'medium' | 'small'} VideoSize
 */
export type VideoSize = 'large' | 'medium' | 'small';

/**
 * Query parameters accepted by the Pexels `/videos/search` endpoint.
 * 
 * @interface
 */
export interface SearchQueryParams {
  query?: string;
  page?: string;
  per_page?: string;
  orientation?: string;
  size?: string;
  min_duration?: string;
  max_duration?: string;
}

/**
 * Query parameters accepted by the Pexels `/videos/popular` endpoint.
 * 
 * @interface
 */
export interface PopularQueryParams {
  page?: string;
  per_page?: string;
  min_width?: string;
  min_height?: string;
  min_duration?: string;
  max_duration?: string;
}
