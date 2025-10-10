"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    constructor(registerUseCase, loginUseCase) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.register = async (req, res) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ error: 'Email and password are required' });
                    return;
                }
                const result = await this.registerUseCase.execute(email, password);
                res.status(201).json({
                    message: 'User registered successfully',
                    data: result,
                });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res.status(400).json({ error: 'Email and password are required' });
                    return;
                }
                const result = await this.loginUseCase.execute(email, password);
                res.status(200).json({
                    message: 'Login successful',
                    data: result,
                });
            }
            catch (error) {
                res.status(401).json({ error: error.message });
            }
        };
        this.getProfile = async (req, res) => {
            res.status(200).json({
                message: 'Profile retrieved successfully',
                data: { user: req.user },
            });
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map