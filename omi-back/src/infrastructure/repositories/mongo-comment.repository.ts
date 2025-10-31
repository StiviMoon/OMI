import { DatabaseConnection } from '../database/connection';
import { Comment } from '../../domain/entities/comment.entity';
import { ICommentRepository } from '../../domain/repositories/comment.repository';
import { ObjectId } from 'mongodb';

interface ICommentDocument {
  _id?: ObjectId;
  userId: string;
  videoLink: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
}

export class MongoCommentRepository implements ICommentRepository {
  private collection = DatabaseConnection.getInstance().getCollection<ICommentDocument>('comments');

  constructor() {
    console.log('✅ MongoCommentRepository using collection: comments');
  }

  async addComment(
    userId: string,
    videoLink: string,
    content: string,
    userFirstName?: string,
    userLastName?: string,
    userEmail?: string
  ): Promise<Comment> {
    const now = new Date();
    const commentDoc: ICommentDocument = {
      userId,
      videoLink,
      content,
      createdAt: now,
      updatedAt: now,
      userFirstName,
      userLastName,
      userEmail,
    };

    const result = await this.collection.insertOne(commentDoc);
    const insertedDoc = await this.collection.findOne({ _id: result.insertedId });
    
    if (!insertedDoc) {
      throw new Error('Failed to create comment');
    }

    return this.mapDocumentToEntity(insertedDoc as ICommentDocument);
  }

  async getCommentsByVideo(videoLink: string): Promise<Comment[]> {
    const results = await this.collection
      .find({ videoLink })
      .sort({ createdAt: -1 })
      .toArray();

    return results.map(doc => this.mapDocumentToEntity(doc as ICommentDocument));
  }

  async getCommentById(commentId: string): Promise<Comment | null> {
    const doc = await this.collection.findOne({ _id: new ObjectId(commentId) });
    if (!doc) return null;
    return this.mapDocumentToEntity(doc as ICommentDocument);
  }

  async updateComment(commentId: string, userId: string, content: string): Promise<Comment> {
    const now = new Date();
    await this.collection.updateOne(
      { _id: new ObjectId(commentId), userId },
      { $set: { content, updatedAt: now } }
    );

    const updatedDoc = await this.collection.findOne({ _id: new ObjectId(commentId) });
    if (!updatedDoc) {
      throw new Error('Comment not found after update');
    }

    return this.mapDocumentToEntity(updatedDoc as ICommentDocument);
  }

  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(commentId), userId });
    return result.deletedCount > 0;
  }

  async getUserComments(userId: string): Promise<Comment[]> {
    const results = await this.collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return results.map(doc => this.mapDocumentToEntity(doc as ICommentDocument));
  }

  private mapDocumentToEntity(doc: ICommentDocument): Comment {
    return new Comment(
      doc._id?.toString() || '',
      doc.userId,
      doc.videoLink,
      doc.content,
      doc.createdAt,
      doc.updatedAt,
      doc.userFirstName,
      doc.userLastName,
      doc.userEmail
    );
  }
}

