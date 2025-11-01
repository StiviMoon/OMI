import { IRatingRepository } from '../repositories/rating.repository';

export class DeleteRatingUseCase {
  constructor(private ratingRepository: IRatingRepository) {}

  async execute(ratingId: string, userId: string): Promise<boolean> {
    if (!ratingId || !userId) {
      throw new Error('Rating ID and user ID are required');
    }

    const success = await this.ratingRepository.deleteRating(ratingId, userId);
    
    if (!success) {
      throw new Error('Rating not found or you do not have permission to delete it');
    }

    return success;
  }
}