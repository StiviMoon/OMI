import { IRatingRepository } from "../repositories/rating.repository";

export class UpdateRatingUseCase {
  constructor(private ratingRepo: IRatingRepository) {}

  async execute(userId: string, pexelsId: string, score: number, comment: string): Promise<boolean> {
    return this.ratingRepo.updateRating(userId, pexelsId, score, comment);
  }
}
