import { IFavoriteRepository } from "../repositories/favorite.repository";
import { Favorite } from "../entities/favorite.entity";

export class AddFavoriteUseCase {
  constructor(private favoriteRepo: IFavoriteRepository) {}

  async execute(userId: string, pexelsId: string, mediaType: 'photo' | 'video'): Promise<Favorite> {
    const alreadyExists = await this.favoriteRepo.isFavorite(userId, pexelsId);
    if (alreadyExists) throw new Error('Already added to favorites');

    return this.favoriteRepo.addFavorite(userId, pexelsId, mediaType);
  }
}
