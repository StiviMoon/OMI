import { IRatingRepository } from "../repositories/rating.repository";

export class DeleteRatingUseCase {
  constructor(private ratingRepo: IRatingRepository) {}

  async execute(userId: string, pexelsId: string): Promise<boolean> {
    return this.ratingRepo.deleteRating(userId, pexelsId);
  }
}
