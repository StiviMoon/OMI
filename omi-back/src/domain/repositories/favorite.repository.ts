import { Favorite } from '../entities/favorite.entity';

export interface IFavoriteRepository {
  addFavorite(userId: string, pexelsId: string, mediaType: 'photo' | 'video', metadata?: Record<string, unknown>): Promise<Favorite>;
  removeFavorite(userId: string, pexelsId: string): Promise<boolean>;
  getUserFavorites(userId: string): Promise<Favorite[]>;
  isFavorite(userId: string, pexelsId: string): Promise<boolean>;
}
