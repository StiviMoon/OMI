import { Rating } from '../entities/rating.entity';

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface IRatingRepository {
  addOrUpdateRating(
    userId: string,
    videoLink: string,
    score: number,
    userFirstName?: string,
    userLastName?: string,
    userEmail?: string
  ): Promise<Rating>;
  getRatingsByVideo(videoLink: string): Promise<Rating[]>;
  getRatingStats(videoLink: string): Promise<RatingStats>;
  getUserRatingForVideo(userId: string, videoLink: string): Promise<Rating | null>;
  deleteRating(ratingId: string, userId: string): Promise<boolean>;
  getUserRatings(userId: string): Promise<Rating[]>;
}