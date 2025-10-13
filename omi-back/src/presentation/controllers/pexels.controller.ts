import { Request, Response, NextFunction } from 'express';
import { PexelsService } from '../../infrastructure/services/pexels.service';

export class PexelsController {
  constructor(private pexelsService: PexelsService) {}

  /**
   * Search videos with filters
   * GET /api/videos/search
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

      // Validate required query parameter
      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Query parameter is required',
        });
        return;
      }

      // Parse and validate pagination
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

      // Validate orientation if provided
      if (orientation && !['landscape', 'portrait', 'square'].includes(orientation as string)) {
        res.status(400).json({
          success: false,
          message: 'Invalid orientation (must be: landscape, portrait, or square)',
        });
        return;
      }

      // Validate size if provided
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
   * Get popular/curated videos
   * GET /api/videos/popular
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

      // Parse and validate pagination
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

      // Build options
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
   * Get video by ID
   * GET /api/videos/:id
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

