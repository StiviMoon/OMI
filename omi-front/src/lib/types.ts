// Re-exportar tipos de autenticación
export type { User } from './types/auth.types';

// ✅ NUEVO: Tipos para window.storage
export interface StorageResult {
  key: string;
  value: string;
  shared: boolean;
}

export interface StorageListResult {
  keys: string[];
  prefix?: string;
  shared: boolean;
}

export interface StorageDeleteResult {
  key: string;
  deleted: boolean;
  shared: boolean;
}

export interface WindowStorage {
  get(key: string, shared?: boolean): Promise<StorageResult | null>;
  set(key: string, value: string, shared?: boolean): Promise<StorageResult | null>;
  delete(key: string, shared?: boolean): Promise<StorageDeleteResult | null>;
  list(prefix?: string, shared?: boolean): Promise<StorageListResult | null>;
}

// ✅ NUEVO: Extender Window
declare global {
  interface Window {
    storage: WindowStorage;
    fs?: {
      readFile(path: string, options?: { encoding?: string }): Promise<Uint8Array | string>;
    };
  }
}

export interface Movie {
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
}

// ✅ NUEVO: Tipo para favoritos
export interface FavoriteVideo extends Movie {
  addedAt: number;
}

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

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