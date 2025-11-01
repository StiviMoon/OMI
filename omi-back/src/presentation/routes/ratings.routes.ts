import { Router } from 'express';
import { RatingsController } from '../controllers/ratings.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const createRatingsRoutes = (ratingsController: RatingsController): Router => {
  const router = Router();

  // Public route - anyone can view rating stats
  router.get('/stats', ratingsController.getStats.bind(ratingsController));

  // Protected routes - require authentication
  router.post('/', authenticateToken, ratingsController.addOrUpdate.bind(ratingsController));
  router.get('/user', authenticateToken, ratingsController.getUserRating.bind(ratingsController));
  router.delete('/:ratingId', authenticateToken, ratingsController.delete.bind(ratingsController));

  return router;
};

export default createRatingsRoutes;