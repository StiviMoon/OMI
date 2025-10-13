<<<<<<< HEAD
// Video Quality Types
export type VideoQuality = 'hd' | 'sd' | 'uhd' | '4k';
export type VideoFileType = 'video/mp4' | 'video/webm' | 'video/ogg';

// Video File Types
export interface VideoFile {
  id: number;
  quality: VideoQuality;
  file_type: VideoFileType;
=======
// Video File Types
export interface VideoFile {
  id: number;
  quality: string; // 'hd' | 'sd' | 'uhd' | '4k'
  file_type: string; // 'video/mp4'
>>>>>>> 2fb44f65e610ec05145f5544ac5f946d4ef9c2a2
  width: number;
  height: number;
  fps: number;
  link: string;
}

// Video Picture (Thumbnail)
export interface VideoPicture {
  id: number;
  picture: string;
  nr: number;
}

// User Information
export interface VideoUser {
  id: number;
  name: string;
  url: string;
}

// Main Video Interface
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

// Search Videos Response
export interface PexelsVideosSearchResponse {
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: PexelsVideo[];
  next_page?: string;
  prev_page?: string;
}

// Popular Videos Response
export interface PexelsPopularVideosResponse {
  page: number;
  per_page: number;
  total_results: number;
  url: string;
  videos: PexelsVideo[];
  next_page?: string;
  prev_page?: string;
}

<<<<<<< HEAD
// API Response wrapper específico para Pexels (renombrado para evitar conflicto)
export interface PexelsApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
=======
// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
>>>>>>> 2fb44f65e610ec05145f5544ac5f946d4ef9c2a2
}

// Simplified Video for Frontend
export interface SimplifiedVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  tags: string[];
  url: string;
  thumbnail: string;
  user: {
    name: string;
    url: string;
  };
  files: SimplifiedVideoFile[];
}

// Simplified Video File for Frontend
export interface SimplifiedVideoFile {
  quality: VideoQuality;
  width: number;
  height: number;
  link: string;
}

// Video Search/Popular Response for Frontend
export interface VideoListResponse {
  page: number;
  perPage: number;
  totalResults: number;
  videos: SimplifiedVideo[];
  hasMore: boolean;
}

// Single Video Response for Frontend
export interface SingleVideoResponse {
  video: SimplifiedVideo;
}

// Search/Popular Query Parameters
export type VideoOrientation = 'landscape' | 'portrait' | 'square';
export type VideoSize = 'large' | 'medium' | 'small';

export interface SearchQueryParams {
  query?: string;
  page?: string;
  per_page?: string;
  orientation?: string;
  size?: string;
  min_duration?: string;
  max_duration?: string;
}

export interface PopularQueryParams {
  page?: string;
  per_page?: string;
  min_width?: string;
  min_height?: string;
  min_duration?: string;
  max_duration?: string;
}

