import { Router } from 'express';
import { PexelsController } from '../controllers/pexels.controller';

/**
 * Creates and configures video-related routes that communicate
 * with the Pexels API through the {@link PexelsController}.
 * 
 * This router exposes public endpoints to search for videos,
 * retrieve curated/popular ones, and fetch specific videos by ID.
 * 
 * @function
 * @param {PexelsController} pexelsController - Instance of PexelsController used to handle route logic.
 * @returns {Router} Configured Express router for Pexels video routes.
 * 
 * @example
 * import express from 'express';
 * import { PexelsController } from '../controllers/pexels.controller';
 * import { createPexelsRoutes } from '../routes/pexels.routes';
 * 
 * const app = express();
 * const pexelsController = new PexelsController(pexelsService);
 * 
 * app.use('/api/videos', createPexelsRoutes(pexelsController));
 */
export const createPexelsRoutes = (pexelsController: PexelsController): Router => {
  const router = Router();

  /**
   * @route GET /api/videos/search
   * @summary Search videos on Pexels with advanced filters
   * @description Allows clients to search videos using multiple parameters such as orientation, size, duration, and pagination.
   * @query {string} query - Search term (required)
   * @query {number} [page=1] - Page number for pagination
   * @query {number} [per_page=15] - Number of results per page (max 80)
   * @query {'landscape'|'portrait'|'square'} [orientation] - Video orientation
   * @query {'large'|'medium'|'small'} [size] - Video size filter
   * @query {number} [min_duration] - Minimum video duration in seconds
   * @query {number} [max_duration] - Maximum video duration in seconds
   * @access Public
   * 
   * @example
   * GET /api/videos/search?query=ocean&orientation=landscape&per_page=20
   */
  router.get('/search', pexelsController.searchVideos);

  /**
   * @route GET /api/videos/popular
   * @summary Retrieve popular or curated videos from Pexels
   * @description Fetches trending or curated video collections with optional filters.
   * @query {number} [page=1] - Page number for pagination
   * @query {number} [per_page=15] - Number of results per page (max 80)
   * @query {number} [min_width] - Minimum width in pixels
   * @query {number} [min_height] - Minimum height in pixels
   * @query {number} [min_duration] - Minimum duration in seconds
   * @query {number} [max_duration] - Maximum duration in seconds
   * @access Public
   * 
   * @example
   * GET /api/videos/popular?per_page=20&min_width=1920
   */
  router.get('/popular', pexelsController.getPopularVideos);

  /**
   * @route GET /api/videos/:id
   * @summary Retrieve a single video by its Pexels ID
   * @description Fetches detailed information about a specific video from Pexels.
   * @param {string} id - The unique Pexels video ID.
   * @access Public
   * 
   * @example
   * GET /api/videos/123456
   */
  router.get('/:id', pexelsController.getVideoById);

  return router;
};
