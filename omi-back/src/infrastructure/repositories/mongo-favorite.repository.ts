import { DatabaseConnection } from '../database/connection';
import { Favorite } from '../../domain/entities/favorite.entity';
import { IFavoriteRepository } from '../../domain/repositories/favorite.repository';
import { ObjectId } from 'mongodb';

export class MongoFavoriteRepository implements IFavoriteRepository {
  private collection = DatabaseConnection.getInstance().getCollection<Favorite>('favorites');

  async addFavorite(userId: string, pexelsId: string, mediaType: 'photo' | 'video'): Promise<Favorite> {
    const favorite = new Favorite(new ObjectId().toString(), userId, pexelsId, mediaType, new Date());
    await this.collection.insertOne(favorite);
    return favorite;
  }

  async removeFavorite(userId: string, pexelsId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ userId, pexelsId });
    return result.deletedCount > 0;
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const results = await this.collection.find({ userId }).toArray();
    return results as unknown as Favorite[];
  }


  async isFavorite(userId: string, pexelsId: string): Promise<boolean> {
    const favorite = await this.collection.findOne({ userId, pexelsId });
    return !!favorite;
  }
}
