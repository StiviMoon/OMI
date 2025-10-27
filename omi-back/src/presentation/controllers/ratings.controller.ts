import { Request, Response } from 'express';
import { GetRatingsUseCase } from '../../domain/use-cases/get.rating.use-case';
import { AddRatingUseCase } from '../../domain/use-cases/add-rating.use-case';
import { UpdateRatingUseCase } from '../../domain/use-cases/update-rating.use-case';
import { DeleteRatingUseCase } from '../../domain/use-cases/delete-rating.use-case';

export class RatingsController {
  constructor(
    private getRatingsUseCase: GetRatingsUseCase,
    private addRatingUseCase: AddRatingUseCase,
    private updateRatingUseCase: UpdateRatingUseCase,
    private deleteRatingUseCase: DeleteRatingUseCase
  ) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { pexelsId } = req.params;

      if (!pexelsId) {
        res.status(400).json({ error: 'Pexels ID is required' });
        return;
      }

      const ratings = await this.getRatingsUseCase.execute(pexelsId);
      
      res.status(200).json({
        message: 'Ratings retrieved successfully',
        data: ratings.map(rating => rating.toJSON()),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  }

  async add(req: Request, res: Response): Promise<void> {
    try {
      const { userId, pexelsId, score, comment } = req.body;

      if (!userId || !pexelsId || score === undefined || !comment) {
        res.status(400).json({ error: 'User ID, Pexels ID, score, and comment are required' });
        return;
      }

      if (score < 1 || score > 5) {
        res.status(400).json({ error: 'Score must be between 1 and 5' });
        return;
      }

      const rating = await this.addRatingUseCase.execute(userId, pexelsId, score, comment);
      
      res.status(201).json({
        message: 'Rating added successfully',
        data: rating.toJSON(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { userId, pexelsId } = req.params;
      const { score, comment } = req.body;

      if (!userId || !pexelsId || score === undefined || !comment) {
        res.status(400).json({ error: 'Score and comment are required' });
        return;
      }

      if (score < 1 || score > 5) {
        res.status(400).json({ error: 'Score must be between 1 and 5' });
        return;
      }

      const success = await this.updateRatingUseCase.execute(userId, pexelsId, score, comment);
      
      if (!success) {
        res.status(404).json({ error: 'Rating not found' });
        return;
      }

      res.status(200).json({ message: 'Rating updated successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { userId, pexelsId } = req.params;

      if (!userId || !pexelsId) {
        res.status(400).json({ error: 'User ID and Pexels ID are required' });
        return;
      }

      const success = await this.deleteRatingUseCase.execute(userId, pexelsId);
      
      if (!success) {
        res.status(404).json({ error: 'Rating not found' });
        return;
      }

      res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  }
}
