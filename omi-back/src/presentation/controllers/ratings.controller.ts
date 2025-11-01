import { Request, Response } from 'express';
import { AddOrUpdateRatingUseCase } from '../../domain/use-cases/add-or-update-rating.use-case';
import { GetRatingStatsUseCase } from '../../domain/use-cases/get-rating-stats.use-case';
import { GetUserRatingUseCase } from '../../domain/use-cases/get-user-rating.use-case';
import { DeleteRatingUseCase } from '../../domain/use-cases/delete-rating.use-case';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { IUserRepository } from '../../domain/repositories/user.repository';

export class RatingsController {
  constructor(
    private addOrUpdateRatingUseCase: AddOrUpdateRatingUseCase,
    private getRatingStatsUseCase: GetRatingStatsUseCase,
    private getUserRatingUseCase: GetUserRatingUseCase,
    private deleteRatingUseCase: DeleteRatingUseCase,
    private userRepository: IUserRepository
  ) {}

  async addOrUpdate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { videoLink, score } = req.body;
      const userId = req.user.userId;

      if (!videoLink || score === undefined) {
        res.status(400).json({ error: 'Video link and score are required' });
        return;
      }

      if (score < 1 || score > 5) {
        res.status(400).json({ error: 'Score must be between 1 and 5' });
        return;
      }

      // Get user information to include in rating
      const user = await this.userRepository.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const rating = await this.addOrUpdateRatingUseCase.execute(
        userId,
        videoLink,
        score,
        user.firstName,
        user.lastName,
        user.email
      );

      res.status(200).json({
        message: 'Rating saved successfully',
        data: rating.toJSON(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: message });
    }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const { videoLink } = req.query;

      if (!videoLink || typeof videoLink !== 'string') {
        res.status(400).json({ error: 'Video link is required as query parameter' });
        return;
      }

      const decodedVideoLink = decodeURIComponent(videoLink);
      const stats = await this.getRatingStatsUseCase.execute(decodedVideoLink);

      res.status(200).json({
        message: 'Rating stats retrieved successfully',
        data: stats,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  }

  async getUserRating(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { videoLink } = req.query;
      const userId = req.user.userId;

      if (!videoLink || typeof videoLink !== 'string') {
        res.status(400).json({ error: 'Video link is required as query parameter' });
        return;
      }

      const decodedVideoLink = decodeURIComponent(videoLink);
      const rating = await this.getUserRatingUseCase.execute(userId, decodedVideoLink);

      res.status(200).json({
        message: 'User rating retrieved successfully',
        data: rating ? rating.toJSON() : null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { ratingId } = req.params;
      const userId = req.user.userId;

      if (!ratingId) {
        res.status(400).json({ error: 'Rating ID is required' });
        return;
      }

      const success = await this.deleteRatingUseCase.execute(ratingId, userId);

      if (!success) {
        res.status(404).json({ error: 'Rating not found' });
        return;
      }

      res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      const statusCode = message.includes('not found') || message.includes('permission') ? 404 : 400;
      res.status(statusCode).json({ error: message });
    }
  }
}