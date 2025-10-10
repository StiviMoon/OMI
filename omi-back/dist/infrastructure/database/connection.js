"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnection = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../../config");
class DatabaseConnection {
    constructor() {
        this.client = null;
        this.db = null;
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    async connect() {
        try {
            if (this.isConnected()) {
                console.log('✅ Database already connected');
                return;
            }
            console.log('🔌 Connecting to MongoDB Atlas...');
            // Create a MongoClient with optimized configuration
            this.client = new mongodb_1.MongoClient(config_1.config.mongodb.uri, {
                serverApi: {
                    version: mongodb_1.ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                },
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 10000,
                retryWrites: true,
                retryReads: true,
            });
            // Connect the client to the server
            await this.client.connect();
            // Get the database
            this.db = this.client.db(config_1.config.mongodb.dbName);
            // Send a ping to confirm a successful connection
            await this.db.admin().command({ ping: 1 });
            console.log("🏓 Pinged your deployment. You successfully connected to MongoDB!");
        }
        catch (error) {
            console.error('❌ Failed to connect to MongoDB:', error);
            throw error;
        }
    }
    async disconnect() {
        try {
            if (this.client) {
                await this.client.close();
                this.client = null;
                this.db = null;
                console.log('🔌 MongoDB disconnected successfully');
            }
        }
        catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error);
            throw error;
        }
    }
    isConnected() {
        return this.client !== null && this.db !== null;
    }
    getClient() {
        if (!this.client) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.client;
    }
    getDb() {
        if (!this.db) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return this.db;
    }
    getCollection(collectionName) {
        return this.getDb().collection(collectionName);
    }
}
exports.DatabaseConnection = DatabaseConnection;
//# sourceMappingURL=connection.js.map