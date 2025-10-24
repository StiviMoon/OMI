import { IFavoriteRepository } from "../repositories/favorite.repository";
import { Favorite } from "../entities/favorite.entity";

export class ListFavoritesUseCase {
  constructor(private favoriteRepo: IFavoriteRepository) {}

  async execute(userId: string): Promise<Favorite[]> {
    return this.favoriteRepo.getUserFavorites(userId);
  }
}
