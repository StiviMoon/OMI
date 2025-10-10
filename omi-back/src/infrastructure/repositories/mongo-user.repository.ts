import { ObjectId } from 'mongodb';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { DatabaseConnection } from '../database/connection';

interface IUserDocument {
  _id?: ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MongoUserRepository implements IUserRepository {
  private readonly collectionName = 'users';

  private getCollection() {
    return DatabaseConnection.getInstance().getCollection(this.collectionName);
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const collection = this.getCollection();
      const userDoc = await collection.findOne({ 
        email: email.toLowerCase().trim() 
      });
      
      if (!userDoc) return null;
      return this.mapDocumentToEntity(userDoc as IUserDocument);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const collection = this.getCollection();
      const userDoc = await collection.findOne({ 
        _id: new ObjectId(id) 
      });
      
      if (!userDoc) return null;
      return this.mapDocumentToEntity(userDoc as IUserDocument);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async save(user: User): Promise<User> {
    try {
      const collection = this.getCollection();
      
      // Create unique index on email if it doesn't exist
      await collection.createIndex({ email: 1 }, { unique: true });

      const userDoc: IUserDocument = {
        email: user.email.toLowerCase().trim(),
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      const result = await collection.insertOne(userDoc);
      const savedDoc = await collection.findOne({ _id: result.insertedId });
      
      if (!savedDoc) {
        throw new Error('Failed to save user');
      }
      
      return this.mapDocumentToEntity(savedDoc as IUserDocument);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    try {
      const collection = this.getCollection();
      const count = await collection.countDocuments({ 
        email: email.toLowerCase().trim() 
      });
      return count > 0;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      throw error;
    }
  }

  private mapDocumentToEntity(doc: IUserDocument): User {
    return new User(
      doc._id?.toString() || '',
      doc.email,
      doc.password,
      doc.createdAt,
      doc.updatedAt
    );
  }
}
