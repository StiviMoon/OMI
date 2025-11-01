import { IRatingRepository } from '../repositories/rating.repository';
import { Rating } from '../entities/rating.entity';

export class AddOrUpdateRatingUseCase {
  constructor(private ratingRepository: IRatingRepository) {}

  async execute(
    userId: string,
    videoLink: string,
    score: number,
    userFirstName?: string,
    userLastName?: string,
    userEmail?: string
  ): Promise<Rating> {
    if (!userId || !videoLink) {
      throw new Error('User ID and video link are required');
    }

    if (score < 1 || score > 5) {
      throw new Error('Rating score must be between 1 and 5');
    }

    return await this.ratingRepository.addOrUpdateRating(
      userId,
      videoLink,
      score,
      userFirstName,
      userLastName,
      userEmail
    );
  }
}