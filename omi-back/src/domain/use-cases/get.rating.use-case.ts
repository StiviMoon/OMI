import { IRatingRepository } from "../repositories/rating.repository";
import { Rating } from "../entities/rating.entity";

export class GetRatingsUseCase {
  constructor(private ratingRepo: IRatingRepository) {}

  async execute(pexelsId: string): Promise<Rating[]> {
    return this.ratingRepo.getRatingsByPexelsId(pexelsId);
  }
}
