/**
 * Represents a movie or video item used throughout the app.
 *
 * @interface Movie
 */
export interface Movie {
  /** Unique identifier for the movie/video. */
  id: string;
  /** Display title. */
  title: string;
  /** Poster or thumbnail image URL. */
  posterUrl: string;
  /** Direct URL of the video source. */
  videoUrl: string;
  /** Duration of the video in seconds. */
  duration?: number;
  /** Tags or keywords describing the content. */
  tags?: string[];
  /** Metadata about the creator or uploader. */
  user?: {
    name: string;
    url: string;
  };
  /** Video resolution width in pixels. */
  width?: number;
  /** Video resolution height in pixels. */
  height?: number;
  /** Optional release year or published year. */
  year?: number;
  /** Optional rating value (e.g., stars or points). */
  rating?: number;
}

/* ===========================================================
   🧩 Sidebar & UI Components
=========================================================== */

/**
 * Props for the {@link SidebarItem} component.
 */
export interface SidebarItemProps {
  /** Icon element to render. */
  icon: React.ReactNode;
  /** Text label of the item. */
  label: string;
  /** Indicates if the item is currently active/selected. */
  active?: boolean;
  /** Callback fired when the item is clicked. */
  onClick?: () => void;
}

/**
 * Props for the {@link MovieCard} component.
 * Represents a single video card inside the ContentSection.
 */
export interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  videoUrl: string;
  duration?: number;
  tags?: string[];
  user?: {
    name: string;
    url: string;
  };
  width?: number;
  height?: number;
  year?: number;
  rating?: number;
  /** Triggered when the video is added or removed from favorites. */
  onAddToList?: (id: string) => void;
  /** Indicates if the video is already in the user's list. */
  isInList?: boolean;
}

/**
 * Props for the {@link ContentSection} component.
 * Represents a horizontal row of movies grouped by category.
 */
export interface ContentSectionProps {
  /** Section title (e.g., "Popular Videos"). */
  title: string;
  /** Array of movies displayed in the section. */
  movies: Movie[];
  /** Callback for adding/removing items from favorites. */
  onAddToList?: (id: string) => void;
}

/**
 * Props for the {@link HeroBanner} component.
 * Represents the large featured video area at the top of the screen.
 */
export interface HeroBannerProps {
  /** Hero title text. */
  title: string;
  /** Short description or tagline. */
  description: string;
  /** Background image URL for the banner. */
  backdropUrl: string;
  /** Callback when the "Play" button is pressed. */
  onPlay: () => void;
  /** Callback when the "More Info" button is pressed. */
  onMoreInfo: () => void;
}

/* ===========================================================
   🔍 API Request Parameter Types
=========================================================== */

/**
 * Parameters accepted by the `/api/videos/search` endpoint.
 * Used to refine queries with filters like orientation, duration, or size.
 */
export interface SearchParams {
  /** Search query string (required). */
  query: string;
  /** Page number for pagination (default: 1). */
  page?: number;
  /** Number of results per page (default: 15). */
  per_page?: number;
  /** Orientation filter (landscape, portrait, or square). */
  orientation?: 'landscape' | 'portrait' | 'square';
  /** Size filter (large, medium, or small). */
  size?: 'large' | 'medium' | 'small';
  /** Minimum video duration in seconds. */
  min_duration?: number;
  /** Maximum video duration in seconds. */
  max_duration?: number;
}

/**
 * Parameters accepted by the `/api/videos/popular` endpoint.
 * Used to filter curated/popular videos.
 */
export interface PopularParams {
  /** Page number for pagination (default: 1). */
  page?: number;
  /** Number of results per page (default: 15). */
  per_page?: number;
  /** Minimum video width in pixels. */
  min_width?: number;
  /** Minimum video height in pixels. */
  min_height?: number;
  /** Minimum video duration in seconds. */
  min_duration?: number;
  /** Maximum video duration in seconds. */
  max_duration?: number;
}
