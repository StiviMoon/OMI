import { Router } from 'express';
import { PexelsController } from '../controllers/pexels.controller';

export const createPexelsRoutes = (pexelsController: PexelsController): Router => {
  const router = Router();

  /**
   * @route   GET /api/videos/search
   * @desc    Search videos on Pexels with advanced filters
   * @query   query - Search term (required)
   * @query   page - Page number (optional, default: 1)
   * @query   per_page - Results per page (optional, default: 15, max: 80)
   * @query   orientation - Video orientation: landscape, portrait, square (optional)
   * @query   size - Video size: large, medium, small (optional)
   * @query   min_duration - Minimum duration in seconds (optional)
   * @query   max_duration - Maximum duration in seconds (optional)
   * @access  Public
   * @example /api/videos/search?query=ocean&orientation=landscape&per_page=20
   */
  router.get('/search', pexelsController.searchVideos);

  /**
   * @route   GET /api/videos/popular
   * @desc    Get popular/curated videos from Pexels
   * @query   page - Page number (optional, default: 1)
   * @query   per_page - Results per page (optional, default: 15, max: 80)
   * @query   min_width - Minimum video width in pixels (optional)
   * @query   min_height - Minimum video height in pixels (optional)
   * @query   min_duration - Minimum duration in seconds (optional)
   * @query   max_duration - Maximum duration in seconds (optional)
   * @access  Public
   * @example /api/videos/popular?per_page=20&min_width=1920
   */
  router.get('/popular', pexelsController.getPopularVideos);

  /**
   * @route   GET /api/videos/:id
   * @desc    Get specific video by ID
   * @param   id - Video ID (required)
   * @access  Public
   * @example /api/videos/123456
   */
  router.get('/:id', pexelsController.getVideoById);

  return router;
};

