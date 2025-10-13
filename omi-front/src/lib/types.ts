export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  videoUrl: string;        // ✅ Ahora es requerido (sin ?)
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
}

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

// ✅ Actualizado: MovieCardProps sin onPlay
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
  onAddToList?: (id: string) => void;
  isInList?: boolean;
}

// ✅ Actualizado: ContentSectionProps sin onPlay
export interface ContentSectionProps {
  title: string;
  movies: Movie[];
  onAddToList?: (id: string) => void;
}

export interface HeroBannerProps {
  title: string;
  description: string;
  backdropUrl: string;
  onPlay: () => void;
  onMoreInfo: () => void;
}

// Tipos para los parámetros de búsqueda
export interface SearchParams {
  query: string;
  page?: number;
  per_page?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  size?: 'large' | 'medium' | 'small';
  min_duration?: number;
  max_duration?: number;
}

export interface PopularParams {
  page?: number;
  per_page?: number;
  min_width?: number;
  min_height?: number;
  min_duration?: number;
  max_duration?: number;
}