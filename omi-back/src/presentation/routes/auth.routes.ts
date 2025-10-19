import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  // Public routes
  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.post('/forgot-password', authController.forgotPassword);
  router.post('/reset-password', authController.resetPassword);

  // Protected routes
  router.get('/profile', authenticateToken, authController.getProfile);
  router.put('/profile', authenticateToken, authController.updateProfile);
  router.delete('/account', authenticateToken, authController.deleteAccount);

  return router;
};
