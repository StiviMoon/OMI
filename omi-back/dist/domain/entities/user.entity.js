"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class User {
    constructor(id, email, password, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static async create(email, password) {
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const now = new Date();
        return new User('', // Will be set by the repository
        email.toLowerCase().trim(), hashedPassword, now, now);
    }
    async validatePassword(password) {
        return bcryptjs_1.default.compare(password, this.password);
    }
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map