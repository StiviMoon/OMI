"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_entity_1 = require("../entities/user.entity");
const config_1 = require("../../config");
class RegisterUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, password) {
        // Check if user already exists
        const existingUser = await this.userRepository.existsByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        // Create new user
        const user = await user_entity_1.User.create(email, password);
        const savedUser = await this.userRepository.save(user);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: savedUser.id, email: savedUser.email }, config_1.config.jwt.secret);
        return {
            user: savedUser.toJSON(),
            token,
        };
    }
}
exports.RegisterUseCase = RegisterUseCase;
//# sourceMappingURL=register.use-case.js.map