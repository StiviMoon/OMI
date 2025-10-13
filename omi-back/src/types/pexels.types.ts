// Video File Types
export interface VideoFile {
  id: number;
  quality: string; // 'hd' | 'sd' | 'uhd' | '4k'
  file_type: string; // 'video/mp4'
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

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
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
  files: {
    quality: string;
    width: number;
    height: number;
    link: string;
  }[];
}

