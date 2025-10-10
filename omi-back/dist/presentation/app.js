"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("../config");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = require("./routes/auth.routes");
const auth_controller_1 = require("./controllers/auth.controller");
const register_use_case_1 = require("../domain/use-cases/register.use-case");
const login_use_case_1 = require("../domain/use-cases/login.use-case");
const mongo_user_repository_1 = require("../infrastructure/repositories/mongo-user.repository");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.setupDependencies();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupDependencies() {
        const userRepository = new mongo_user_repository_1.MongoUserRepository();
        const registerUseCase = new register_use_case_1.RegisterUseCase(userRepository);
        const loginUseCase = new login_use_case_1.LoginUseCase(userRepository);
        this.authController = new auth_controller_1.AuthController(registerUseCase, loginUseCase);
    }
    setupMiddleware() {
        this.app.use((0, cors_1.default)({
            origin: config_1.config.cors.origin,
            credentials: true
        }));
        this.app.use(express_1.default.json());
    }
    setupRoutes() {
        this.app.use('/api/auth', (0, auth_routes_1.createAuthRoutes)(this.authController));
        this.app.get('/', (req, res) => {
            res.json({ message: 'OMI Auth API' });
        });
    }
    setupErrorHandling() {
        this.app.use(error_middleware_1.errorHandler);
    }
    getApp() {
        return this.app;
    }
    listen() {
        this.app.listen(config_1.config.port, () => {
            console.log(`Server running on port ${config_1.config.port}`);
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map