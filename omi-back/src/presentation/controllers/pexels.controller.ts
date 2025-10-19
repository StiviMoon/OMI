import { Request, Response, NextFunction } from 'express';
import { PexelsService } from '../../infrastructure/services/pexels.service';

/**
 * Controller responsible for handling video-related routes
 * and communication with the Pexels API through the PexelsService.
 */
export class PexelsController {
  /**
   * Creates an instance of PexelsController.
   * 
   * @param {PexelsService} pexelsService - Service used to interact with the Pexels API.
   */
  constructor(private pexelsService: PexelsService) {}

  /**
   * Handles video search requests using query filters.
   * 
   * Validates query parameters and delegates the search to the PexelsService.
   * Returns paginated, simplified video results.
   * 
   * @async
   * @route GET /api/videos/search
   * @param {Request} req - Express request containing search filters.
   * @param {Response} res - Express response used to send the results.
   * @param {NextFunction} next - Express next function for error handling.
   * @returns {Promise<void>} A promise that resolves once the response is sent.
   * 
   * @example
   * GET /api/videos/search?query=nature&page=1&per_page=10
   */
  searchVideos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        query,
        page = '1',
        per_page = '15',
        orientation,
        size,
        min_duration,
        max_duration,
      } = req.query;

      // Validate query
      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Query parameter is required',
        });
        return;
      }

      // Parse pagination
      const pageNum = parseInt(page as string, 10);
      const perPageNum = parseInt(per_page as string, 10);

      if (isNaN(pageNum) || pageNum < 1) {
        res.status(400).json({
          success: false,
          message: 'Invalid page parameter (must be >= 1)',
        });
        return;
      }

      if (isNaN(perPageNum) || perPageNum < 1 || perPageNum > 80) {
        res.status(400).json({
          success: false,
          message: 'Invalid per_page parameter (must be between 1 and 80)',
        });
        return;
      }

      // Validate optional filters
      if (orientation && !['landscape', 'portrait', 'square'].includes(orientation as string)) {
        res.status(400).json({
          success: false,
          message: 'Invalid orientation (must be: landscape, portrait, or square)',
        });
        return;
      }

      if (size && !['large', 'medium', 'small'].includes(size as string)) {
        res.status(400).json({
          success: false,
          message: 'Invalid size (must be: large, medium, or small)',
        });
        return;
      }

      // Build search options
      const searchOptions = {
        query,
        page: pageNum,
        perPage: perPageNum,
        ...(orientation && { orientation: orientation as 'landscape' | 'portrait' | 'square' }),
        ...(size && { size: size as 'large' | 'medium' | 'small' }),
        ...(min_duration && { minDuration: parseInt(min_duration as string, 10) }),
        ...(max_duration && { maxDuration: parseInt(max_duration as string, 10) }),
      };

      const result = await this.pexelsService.searchVideos(searchOptions);
      const simplifiedVideos = this.pexelsService.simplifyVideos(result.videos);

      res.json({
        success: true,
        data: {
          page: result.page,
          perPage: result.per_page,
          totalResults: result.total_results,
          videos: simplifiedVideos,
          hasMore: !!result.next_page,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves curated/popular videos from Pexels with optional filters.
   * 
   * @async
   * @route GET /api/videos/popular
   * @param {Request} req - Express request containing optional query parameters.
   * @param {Response} res - Express response used to send the results.
   * @param {NextFunction} next - Express next function for error handling.
   * @returns {Promise<void>} A promise that resolves once the response is sent.
   * 
   * @example
   * GET /api/videos/popular?page=1&per_page=10
   */
  getPopularVideos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        page = '1',
        per_page = '15',
        min_width,
        min_height,
        min_duration,
        max_duration,
      } = req.query;

      const pageNum = parseInt(page as string, 10);
      const perPageNum = parseInt(per_page as string, 10);

      if (isNaN(pageNum) || pageNum < 1) {
        res.status(400).json({
          success: false,
          message: 'Invalid page parameter (must be >= 1)',
        });
        return;
      }

      if (isNaN(perPageNum) || perPageNum < 1 || perPageNum > 80) {
        res.status(400).json({
          success: false,
          message: 'Invalid per_page parameter (must be between 1 and 80)',
        });
        return;
      }

      // Build filter options
      const options = {
        page: pageNum,
        perPage: perPageNum,
        ...(min_width && { minWidth: parseInt(min_width as string, 10) }),
        ...(min_height && { minHeight: parseInt(min_height as string, 10) }),
        ...(min_duration && { minDuration: parseInt(min_duration as string, 10) }),
        ...(max_duration && { maxDuration: parseInt(max_duration as string, 10) }),
      };

      const result = await this.pexelsService.getPopularVideos(options);
      const simplifiedVideos = this.pexelsService.simplifyVideos(result.videos);

      res.json({
        success: true,
        data: {
          page: result.page,
          perPage: result.per_page,
          totalResults: result.total_results,
          videos: simplifiedVideos,
          hasMore: !!result.next_page,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves a specific video from Pexels by its ID.
   * 
   * @async
   * @route GET /api/videos/:id
   * @param {Request} req - Express request containing the video ID as a route parameter.
   * @param {Response} res - Express response used to send the video data.
   * @param {NextFunction} next - Express next function for error handling.
   * @returns {Promise<void>} A promise that resolves once the response is sent.
   * 
   * @example
   * GET /api/videos/123456
   */
  getVideoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Video ID is required',
        });
        return;
      }

      const videoId = parseInt(id, 10);
      if (isNaN(videoId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid video ID',
        });
        return;
      }

      const video = await this.pexelsService.getVideoById(videoId);
      const simplifiedVideo = this.pexelsService.simplifyVideo(video);

      res.json({
        success: true,
        data: simplifiedVideo,
      });
    } catch (error) {
      next(error);
    }
  };
}
