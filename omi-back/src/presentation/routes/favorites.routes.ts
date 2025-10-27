import { Router } from 'express';
import { FavoritesController } from '../controllers/favorites.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const createFavoritesRoutes = (favoritesController: FavoritesController): Router => {
  const router = Router();

  router.post('/', authenticateToken, favoritesController.add.bind(favoritesController));
  router.get('/:userId/:pexelsId/status', authenticateToken, favoritesController.check.bind(favoritesController));
  router.delete('/:userId/:pexelsId', authenticateToken, favoritesController.remove.bind(favoritesController));
  router.get('/:userId', authenticateToken, favoritesController.list.bind(favoritesController));

  return router;
};

export default createFavoritesRoutes;
