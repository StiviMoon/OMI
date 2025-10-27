import { IRatingRepository } from "../repositories/rating.repository";
import { Rating } from "../entities/rating.entity";

export class AddRatingUseCase {
  constructor(private ratingRepo: IRatingRepository) {}

  async execute(userId: string, pexelsId: string, score: number, comment: string): Promise<Rating> {
    const existing = await this.ratingRepo.getUserRating(userId, pexelsId);
    if (existing) throw new Error('User already rated this item');

    return this.ratingRepo.addRating(userId, pexelsId, score, comment);
  }
}
