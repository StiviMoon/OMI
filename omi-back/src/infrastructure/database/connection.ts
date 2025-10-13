import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import { config } from '../../config';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

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
        // TLS/SSL options to fix OpenSSL 3.x compatibility issues
        tls: true,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
      });

      // Connect the client to the server
      await this.client.connect();
      
      // Get the database
      this.db = this.client.db(config.mongodb.dbName);

      // Send a ping to confirm a successful connection
      await this.db.admin().command({ ping: 1 });
      console.log("🏓 Pinged your deployment. You successfully connected to MongoDB!");

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      throw error;
    }
  }

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

  public isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }

  public getClient(): MongoClient {
    if (!this.client) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.client;
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  public getCollection<T = any>(collectionName: string) {
    return this.getDb().collection(collectionName);
  }
}
