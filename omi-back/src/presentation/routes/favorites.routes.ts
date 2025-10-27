import { Router } from 'express';
import { FavoritesController } from '../controllers/favorites.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const createFavoritesRoutes = (favoritesController: FavoritesController): Router => {
  const router = Router();

  router.get('/:userId', authenticateToken, favoritesController.list.bind(favoritesController));
  router.post('/', authenticateToken, favoritesController.add.bind(favoritesController));
  router.delete('/:userId/:pexelsId', authenticateToken, favoritesController.remove.bind(favoritesController));
  router.get('/:userId/:pexelsId', authenticateToken, favoritesController.check.bind(favoritesController));

  return router;
};

export default createFavoritesRoutes;
