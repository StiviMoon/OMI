import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import { config } from '../../config';

/**
 * Handles MongoDB connection using the Singleton design pattern.
 * 
 * This class provides a centralized and optimized way to manage
 * MongoDB connections, ensuring that only one instance of the
 * database client exists throughout the application lifecycle.
 */
export class DatabaseConnection {
  /** Singleton instance of the DatabaseConnection */
  private static instance: DatabaseConnection;
  /** MongoDB client instance */
  private client: MongoClient | null = null;
  /** Reference to the MongoDB database */
  private db: Db | null = null;

  /** Private constructor to prevent direct instantiation. */
  private constructor() {}

  /**
   * Returns the singleton instance of the DatabaseConnection.
   * 
   * @returns {DatabaseConnection} The single instance of the connection handler.
   * 
   * @example
   * const dbConnection = DatabaseConnection.getInstance();
   */
  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Establishes a connection to MongoDB using configuration from environment variables.
   * 
   * Includes optimized options for performance and stability, as well as
   * TLS/SSL parameters for compatibility with OpenSSL 3.x.
   * 
   * @async
   * @returns {Promise<void>} A promise that resolves when the connection is established.
   * @throws {Error} If the connection attempt fails.
   * 
   * @example
   * await DatabaseConnection.getInstance().connect();
   */
  public async connect(): Promise<void> {
    try {
      if (this.isConnected()) {
        console.log('✅ Database already connected');
        return;
      }

      console.log('🔌 Connecting to MongoDB Atlas...');

      // Create a MongoClient with optimized configuration
      this.client = new MongoClient(config.mongodb.uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        retryWrites: true,
        retryReads: true,
        tls: true,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
      });

      // Connect to the server
      await this.client.connect();

      // Select the database
      this.db = this.client.db(config.mongodb.dbName);

      // Verify connection with a ping command
      await this.db.admin().command({ ping: 1 });
      console.log('🏓 Successfully connected to MongoDB!');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  /**
   * Closes the MongoDB connection gracefully.
   * 
   * @async
   * @returns {Promise<void>} A promise that resolves when the connection is closed.
   * @throws {Error} If an error occurs while disconnecting.
   * 
   * @example
   * await DatabaseConnection.getInstance().disconnect();
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
        this.db = null;
        console.log('🔌 MongoDB disconnected successfully');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Checks if the database is currently connected.
   * 
   * @returns {boolean} True if connected, otherwise false.
   * 
   * @example
   * const isConnected = DatabaseConnection.getInstance().isConnected();
   */
  public isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }

  /**
   * Returns the MongoDB client instance.
   * 
   * @returns {MongoClient} The active MongoDB client.
   * @throws {Error} If the client is not connected.
   * 
   * @example
   * const client = DatabaseConnection.getInstance().getClient();
   */
  public getClient(): MongoClient {
    if (!this.client) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.client;
  }

  /**
   * Returns the active database reference.
   * 
   * @returns {Db} The MongoDB database object.
   * @throws {Error} If the database is not connected.
   * 
   * @example
   * const db = DatabaseConnection.getInstance().getDb();
   */
  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  /**
   * Retrieves a collection from the connected database.
   * 
   * @template T
   * @param {string} collectionName - The name of the collection to retrieve.
   * @returns {import('mongodb').Collection<T>} The MongoDB collection.
   * 
   * @example
   * const users = DatabaseConnection.getInstance().getCollection<User>('users');
   */
  public getCollection<T = any>(collectionName: string) {
    return this.getDb().collection<T>(collectionName);
  }
}
