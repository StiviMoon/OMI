"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUserRepository = void 0;
const mongodb_1 = require("mongodb");
const user_entity_1 = require("../../domain/entities/user.entity");
const connection_1 = require("../database/connection");
class MongoUserRepository {
    constructor() {
        this.collectionName = 'users';
    }
    getCollection() {
        return connection_1.DatabaseConnection.getInstance().getCollection(this.collectionName);
    }
    async findByEmail(email) {
        try {
            const collection = this.getCollection();
            const userDoc = await collection.findOne({
                email: email.toLowerCase().trim()
            });
            if (!userDoc)
                return null;
            return this.mapDocumentToEntity(userDoc);
        }
        catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }
    async findById(id) {
        try {
            const collection = this.getCollection();
            const userDoc = await collection.findOne({
                _id: new mongodb_1.ObjectId(id)
            });
            if (!userDoc)
                return null;
            return this.mapDocumentToEntity(userDoc);
        }
        catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }
    async save(user) {
        try {
            const collection = this.getCollection();
            // Create unique index on email if it doesn't exist
            await collection.createIndex({ email: 1 }, { unique: true });
            const userDoc = {
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
            return this.mapDocumentToEntity(savedDoc);
        }
        catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }
    async existsByEmail(email) {
        try {
            const collection = this.getCollection();
            const count = await collection.countDocuments({
                email: email.toLowerCase().trim()
            });
            return count > 0;
        }
        catch (error) {
            console.error('Error checking if user exists:', error);
            throw error;
        }
    }
    mapDocumentToEntity(doc) {
        return new user_entity_1.User(doc._id?.toString() || '', doc.email, doc.password, doc.createdAt, doc.updatedAt);
    }
}
exports.MongoUserRepository = MongoUserRepository;
//# sourceMappingURL=mongo-user.repository.js.map