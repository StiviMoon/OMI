"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: Number(process.env['PORT']) || 3000,
    nodeEnv: process.env['NODE_ENV'] || 'development',
    mongodb: {
        uri: process.env['MONGODB_URI'] || 'mongodb://localhost:27017/OMI-S',
        dbName: process.env['DB_NAME'] || 'OMI-S',
    },
    jwt: {
        secret: process.env['JWT_SECRET'] || 'your-secret-key',
        expiresIn: process.env['JWT_EXPIRES_IN'] || '24h',
    },
    cors: {
        origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
    },
};
//# sourceMappingURL=index.js.map