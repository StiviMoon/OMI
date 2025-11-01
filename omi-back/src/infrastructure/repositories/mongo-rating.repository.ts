import { DatabaseConnection } from '../database/connection';
import { Rating } from '../../domain/entities/rating.entity';
import { IRatingRepository, RatingStats } from '../../domain/repositories/rating.repository';
import { ObjectId, WithId } from 'mongodb';

interface IRatingDocument {
  _id?: ObjectId;
  userId: string;
  videoLink: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
}

export class MongoRatingRepository implements IRatingRepository {
  private collection = DatabaseConnection.getInstance().getCollection<IRatingDocument>('ratings');

  constructor() {
    console.log('✅ MongoRatingRepository using collection: ratings');
    this.createIndexes();
  }

  private async createIndexes() {
    try {
      // Create compound index for userId + videoLink (ensures one rating per user per video)
      await this.collection.createIndex(
        { userId: 1, videoLink: 1 },
        { unique: true }
      );
      // Create index for videoLink for faster queries
      await this.collection.createIndex({ videoLink: 1 });
      console.log('✅ Rating indexes created');
    } catch (error) {
      console.error('Error creating rating indexes:', error);
    }
  }

  async addOrUpdateRating(
    userId: string,
    videoLink: string,
    score: number,
    userFirstName?: string,
    userLastName?: string,
    userEmail?: string
  ): Promise<Rating> {
    const now = new Date();

    // Use upsert to either insert or update existing rating
    const result = await this.collection.findOneAndUpdate(
      { userId, videoLink },
      {
        $set: {
          score,
          updatedAt: now,
          userFirstName,
          userLastName,
          userEmail,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    // Verificar que result no sea null o undefined
    if (!result) {
      throw new Error('Failed to create or update rating');
    }

    // Extraer el valor si result tiene la propiedad value, sino usar result directamente
    const doc = 'value' in result ? result.value : result;
    
    if (!doc) {
      throw new Error('Failed to create or update rating');
    }

    return this.mapDocumentToEntity(doc as IRatingDocument & { _id: ObjectId });
  }

  async getRatingsByVideo(videoLink: string): Promise<Rating[]> {
    const results = await this.collection
      .find({ videoLink })
      .sort({ createdAt: -1 })
      .toArray();

    return results.map(doc => this.mapDocumentToEntity(doc as IRatingDocument & { _id: ObjectId }));
  }

  async getRatingStats(videoLink: string): Promise<RatingStats> {
    const ratings = await this.getRatingsByVideo(videoLink);

    if (ratings.length === 0) {
      return {
        averageRating: 0,
        totalRatings: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalScore = 0;

    ratings.forEach(rating => {
      distribution[rating.score as keyof typeof distribution]++;
      totalScore += rating.score;
    });

    return {
      averageRating: totalScore / ratings.length,
      totalRatings: ratings.length,
      distribution,
    };
  }

  async getUserRatingForVideo(userId: string, videoLink: string): Promise<Rating | null> {
    const doc = await this.collection.findOne({ userId, videoLink });
    if (!doc) return null;
    return this.mapDocumentToEntity(doc as IRatingDocument & { _id: ObjectId });
  }

  async deleteRating(ratingId: string, userId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ 
      _id: new ObjectId(ratingId), 
      userId 
    });
    return result.deletedCount > 0;
  }

  async getUserRatings(userId: string): Promise<Rating[]> {
    const results = await this.collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return results.map(doc => this.mapDocumentToEntity(doc as IRatingDocument & { _id: ObjectId }));
  }

  private mapDocumentToEntity(doc: IRatingDocument & { _id: ObjectId }): Rating {
    return new Rating(
      doc._id.toString(),
      doc.userId,
      doc.videoLink,
      doc.score,
      doc.createdAt,
      doc.updatedAt,
      doc.userFirstName,
      doc.userLastName,
      doc.userEmail
    );
  }
}