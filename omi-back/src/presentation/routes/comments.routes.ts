import { Router } from 'express';
import { CommentsController } from '../controllers/comments.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const createCommentsRoutes = (commentsController: CommentsController): Router => {
  const router = Router();

  // Public route - anyone can view comments (using query param for videoLink)
  router.get('/video', commentsController.list.bind(commentsController));

  // Protected routes - require authentication
  router.post('/', authenticateToken, commentsController.add.bind(commentsController));
  router.put('/:commentId', authenticateToken, commentsController.update.bind(commentsController));
  router.delete('/:commentId', authenticateToken, commentsController.delete.bind(commentsController));

  return router;
};

export default createCommentsRoutes;

