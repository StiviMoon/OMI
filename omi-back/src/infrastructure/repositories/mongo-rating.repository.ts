import { DatabaseConnection } from '../database/connection';
import { Rating } from '../../domain/entities/rating.entity';
import { IRatingRepository } from '../../domain/repositories/rating.repository';
import { ObjectId } from 'mongodb';

export class RatingRepositoryImpl implements IRatingRepository {
  private collection = DatabaseConnection.getInstance().getCollection<Rating>('ratings');

  async addRating(userId: string, pexelsId: string, score: number, comment: string): Promise<Rating> {
    const rating = new Rating(new ObjectId().toString(), userId, pexelsId, score, comment, new Date());
    await this.collection.insertOne(rating);
    return rating;
  }

  async getRatingsByPexelsId(pexelsId: string): Promise<Rating[]> {
    const results = await this.collection.find({ pexelsId }).toArray();
    return results as unknown as Rating[];
  }

  async getUserRating(userId: string, pexelsId: string): Promise<Rating | null> {
    const result = await this.collection.findOne({ userId, pexelsId });
    return result as unknown as Rating | null;
  }


  async updateRating(userId: string, pexelsId: string, score: number, comment: string): Promise<boolean> {
    const result = await this.collection.updateOne(
      { userId, pexelsId },
      { $set: { score, comment, createdAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async deleteRating(userId: string, pexelsId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ userId, pexelsId });
    return result.deletedCount > 0;
  }
}

