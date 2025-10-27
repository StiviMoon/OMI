import { Request, Response } from 'express';
import { ListFavoritesUseCase } from '../../domain/use-cases/list-favorite.use-case';
import { AddFavoriteUseCase } from '../../domain/use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from '../../domain/use-cases/remove-favorite.use-case';
import { IsFavoriteUseCase } from '../../domain/use-cases/is-favorite.use-case';

export class FavoritesController {
  constructor(
    private listFavoritesUseCase: ListFavoritesUseCase,
    private addFavoriteUseCase: AddFavoriteUseCase,
    private removeFavoriteUseCase: RemoveFavoriteUseCase,
    private isFavoriteUseCase: IsFavoriteUseCase
  ) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }

      console.log('📋 Listing favorites for userId:', userId);
      const favorites = await this.listFavoritesUseCase.execute(userId);
      console.log('✅ Found favorites:', favorites.length);
      
      res.status(200).json({
        message: 'Favorites retrieved successfully',
        data: favorites.map(fav => fav.toJSON()),
      });
    } catch (error) {
      console.error('❌ Error in favorites.list:', error);
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  }

  async add(req: Request, res: Response): Promise<void> {
    try {
      const { userId, pexelsId, mediaType, metadata } = req.body;

      if (!userId || !pexelsId || !mediaType) {
        res.status(400).json({ error: 'User ID, Pexels ID, and media type are required' });
        return;
      }

      if (mediaType !== 'photo' && mediaType !== 'video') {
        res.status(400).json({ error: 'Media type must be either "photo" or "video"' });
        return;
      }

      const favorite = await this.addFavoriteUseCase.execute(userId, pexelsId, mediaType, metadata);
      
      res.status(201).json({
        message: 'Favorite added successfully',
        data: favorite.toJSON(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: message });
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { userId, pexelsId } = req.params;

      if (!userId || !pexelsId) {
        res.status(400).json({ error: 'User ID and Pexels ID are required' });
        return;
      }

      const success = await this.removeFavoriteUseCase.execute(userId, pexelsId);
      
      if (!success) {
        res.status(404).json({ error: 'Favorite not found' });
        return;
      }

      res.status(200).json({ message: 'Favorite removed successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  }

  async check(req: Request, res: Response): Promise<void> {
    try {
      const { userId, pexelsId } = req.params;

      if (!userId || !pexelsId) {
        res.status(400).json({ error: 'User ID and Pexels ID are required' });
        return;
      }

      const isFavorite = await this.isFavoriteUseCase.execute(userId, pexelsId);
      
      res.status(200).json({
        message: 'Favorite status retrieved successfully',
        data: { isFavorite },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  }
}
