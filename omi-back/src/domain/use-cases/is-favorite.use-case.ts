import { IFavoriteRepository } from "../repositories/favorite.repository";

export class IsFavoriteUseCase {
  constructor(private favoriteRepo: IFavoriteRepository) {}

  async execute(userId: string, pexelsId: string): Promise<boolean> {
    return this.favoriteRepo.isFavorite(userId, pexelsId);
  }
}
