import { ObjectId } from 'mongodb';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { DatabaseConnection } from '../database/connection';

/**
 * Represents the MongoDB document structure for a user.
 * 
 * @interface
 */
interface IUserDocument {
  _id?: ObjectId;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * MongoDB implementation of the IUserRepository interface.
 * 
 * This repository provides methods for user persistence operations such as
 * creating, retrieving, and verifying user records within a MongoDB database.
 */
export class MongoUserRepository implements IUserRepository {
  /** Name of the MongoDB collection used for storing user documents. */
  private readonly collectionName = 'users';

  /**
   * Retrieves the MongoDB collection for users.
   * 
   * @private
   * @returns {import('mongodb').Collection<IUserDocument>} The user collection.
   */
  private getCollection() {
    return DatabaseConnection.getInstance().getCollection<IUserDocument>(this.collectionName);
  }

  /**
   * Finds a user by their email address.
   * 
   * @async
   * @param {string} email - The user's email address.
   * @returns {Promise<User|null>} A promise resolving to the user entity if found, otherwise null.
   * @throws {Error} If a database error occurs.
   * 
   * @example
   * const user = await mongoUserRepository.findByEmail('example@test.com');
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const collection = this.getCollection();
      const userDoc = await collection.findOne({
        email: email.toLowerCase().trim(),
      });

      if (!userDoc) return null;
      return this.mapDocumentToEntity(userDoc as IUserDocument);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Finds a user by their unique identifier.
   * 
   * @async
   * @param {string} id - The user's MongoDB ObjectId as a string.
   * @returns {Promise<User|null>} A promise resolving to the user entity if found, otherwise null.
   * @throws {Error} If a database error occurs.
   * 
   * @example
   * const user = await mongoUserRepository.findById('65b3f0c7e89b...ab');
   */
  async findById(id: string): Promise<User | null> {
    try {
      const collection = this.getCollection();
      const userDoc = await collection.findOne({
        _id: new ObjectId(id),
      });

      if (!userDoc) return null;
      return this.mapDocumentToEntity(userDoc as IUserDocument);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Saves a new user entity into the MongoDB collection.
   * 
   * @async
   * @param {User} user - The user entity to persist.
   * @returns {Promise<User>} A promise resolving to the saved user entity.
   * @throws {Error} If saving the user fails or a database error occurs.
   * 
   * @example
   * const savedUser = await mongoUserRepository.save(user);
   */
  async save(user: User): Promise<User> {
    try {
      const collection = this.getCollection();

      // Ensure unique email index
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

  /**
   * Checks if a user exists with the specified email address.
   * 
   * @async
   * @param {string} email - The email address to check for existence.
   * @returns {Promise<boolean>} True if a user with the given email exists, otherwise false.
   * @throws {Error} If a database error occurs.
   * 
   * @example
   * const exists = await mongoUserRepository.existsByEmail('example@test.com');
   */
  async existsByEmail(email: string): Promise<boolean> {
    try {
      const collection = this.getCollection();
      const count = await collection.countDocuments({
        email: email.toLowerCase().trim(),
      });
      return count > 0;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      throw error;
    }
  }

  /**
   * Maps a MongoDB user document to a User entity.
   * 
   * @private
   * @param {IUserDocument} doc - The MongoDB document.
   * @returns {User} The corresponding User entity.
   * 
   * @example
   * const entity = mongoUserRepository.mapDocumentToEntity(userDoc);
   */
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
