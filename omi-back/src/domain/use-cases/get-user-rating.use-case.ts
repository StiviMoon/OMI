import { IRatingRepository } from '../repositories/rating.repository';
import { Rating } from '../entities/rating.entity';

export class GetUserRatingUseCase {
  constructor(private ratingRepository: IRatingRepository) {}

  async execute(userId: string, videoLink: string): Promise<Rating | null> {
    if (!userId || !videoLink) {
      throw new Error('User ID and video link are required');
    }

    return await this.ratingRepository.getUserRatingForVideo(userId, videoLink);
  }
}