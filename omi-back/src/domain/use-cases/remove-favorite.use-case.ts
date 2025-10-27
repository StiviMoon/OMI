import { IFavoriteRepository } from "../repositories/favorite.repository";

export class RemoveFavoriteUseCase {
  constructor(private favoriteRepo: IFavoriteRepository) {}

  async execute(userId: string, pexelsId: string): Promise<boolean> {
    return this.favoriteRepo.removeFavorite(userId, pexelsId);
  }
}
