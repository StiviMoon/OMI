"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const createAuthRoutes = (authController) => {
    const router = (0, express_1.Router)();
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.get('/profile', auth_middleware_1.authenticateToken, authController.getProfile);
    return router;
};
exports.createAuthRoutes = createAuthRoutes;
//# sourceMappingURL=auth.routes.js.map