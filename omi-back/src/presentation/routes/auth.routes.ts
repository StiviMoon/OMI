import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

/**
 * Creates and configures authentication-related routes.
 * 
 * This function initializes Express routes for user registration,
 * login, and profile retrieval, connecting them to the corresponding
 * methods of the {@link AuthController}. The `/profile` route is
 * protected by the {@link authenticateToken} middleware.
 * 
 * @function
 * @param {AuthController} authController - Instance of AuthController containing authentication handlers.
 * @returns {Router} Configured Express router for authentication routes.
 * 
 * @example
 * import express from 'express';
 * import { AuthController } from '../controllers/auth.controller';
 * import { createAuthRoutes } from '../routes/auth.routes';
 * 
 * const app = express();
 * const authController = new AuthController(registerUseCase, loginUseCase);
 * 
 * app.use('/api/auth', createAuthRoutes(authController));
 */
export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  /**
   * @route POST /api/auth/register
   * @summary Register a new user
   * @description Handles user registration by validating credentials and creating a new account.
   * @access Public
   */
  router.post('/register', authController.register);

  /**
   * @route POST /api/auth/login
   * @summary Authenticate an existing user
   * @description Handles user login and returns a JWT token if successful.
   * @access Public
   */
  router.post('/login', authController.login);

  /**
   * @route GET /api/auth/profile
   * @summary Retrieve authenticated user profile
   * @description Returns profile data for the logged-in user. Requires a valid JWT token.
   * @access Private
   */
  router.get('/profile', authenticateToken, authController.getProfile);

  return router;
};

