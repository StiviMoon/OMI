import { Rating } from '../entities/rating.entity';

export interface IRatingRepository {
  addRating(userId: string, pexelsId: string, score: number, comment: string): Promise<Rating>;
  getRatingsByPexelsId(pexelsId: string): Promise<Rating[]>;
  getUserRating(userId: string, pexelsId: string): Promise<Rating | null>;
  updateRating(userId: string, pexelsId: string, score: number, comment: string): Promise<boolean>;
  deleteRating(userId: string, pexelsId: string): Promise<boolean>;
}
