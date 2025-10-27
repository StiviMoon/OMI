import { Router } from 'express';
import { RatingsController } from '../controllers/ratings.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const createRatingsRoutes = (ratingsController: RatingsController): Router => {
  const router = Router();

  router.get('/:pexelsId', authenticateToken, ratingsController.list.bind(ratingsController));
  router.post('/', authenticateToken, ratingsController.add.bind(ratingsController));
  router.put('/:userId/:pexelsId', authenticateToken, ratingsController.update.bind(ratingsController));
  router.delete('/:userId/:pexelsId', authenticateToken, ratingsController.remove.bind(ratingsController));

  return router;
};

export default createRatingsRoutes;
