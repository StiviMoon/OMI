import { IRatingRepository, RatingStats } from '../repositories/rating.repository';

export class GetRatingStatsUseCase {
  constructor(private ratingRepository: IRatingRepository) {}

  async execute(videoLink: string): Promise<RatingStats> {
    if (!videoLink) {
      throw new Error('Video link is required');
    }

    return await this.ratingRepository.getRatingStats(videoLink);
  }
}