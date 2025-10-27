import { DatabaseConnection } from '../database/connection';
import { Favorite } from '../../domain/entities/favorite.entity';
import { IFavoriteRepository } from '../../domain/repositories/favorite.repository';
import { ObjectId } from 'mongodb';

export class MongoFavoriteRepository implements IFavoriteRepository {
  private collection = DatabaseConnection.getInstance().getCollection<Favorite>('favorites');

  constructor() {
    console.log('✅ MongoFavoriteRepository using collection: favorites');
  }

  async addFavorite(userId: string, pexelsId: string, mediaType: 'photo' | 'video', metadata?: Record<string, unknown>): Promise<Favorite> {
    const favorite = new Favorite(new ObjectId().toString(), userId, pexelsId, mediaType, new Date(), metadata);
    await this.collection.insertOne(favorite);
    return favorite;
  }

  async removeFavorite(userId: string, pexelsId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ userId, pexelsId });
    return result.deletedCount > 0;
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    console.log('🔍 Querying favorites collection for userId:', userId);
    const results = await this.collection.find({ userId }).toArray();
    console.log(`📊 Found ${results.length} documents in favorites collection`);
    return results.map(doc => new Favorite(
      doc._id.toString(),
      doc.userId,
      doc.pexelsId,
      doc.mediaType,
      doc.createdAt,
      doc.metadata
    ));
  }


  async isFavorite(userId: string, pexelsId: string): Promise<boolean> {
    const favorite = await this.collection.findOne({ userId, pexelsId });
    return !!favorite;
  }
}
