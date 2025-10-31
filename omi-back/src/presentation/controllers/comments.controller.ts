import { Request, Response } from 'express';
import { AddCommentUseCase } from '../../domain/use-cases/add-comment.use-case';
import { ListCommentsUseCase } from '../../domain/use-cases/list-comments.use-case';
import { UpdateCommentUseCase } from '../../domain/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from '../../domain/use-cases/delete-comment.use-case';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { IUserRepository } from '../../domain/repositories/user.repository';

export class CommentsController {
  constructor(
    private addCommentUseCase: AddCommentUseCase,
    private listCommentsUseCase: ListCommentsUseCase,
    private updateCommentUseCase: UpdateCommentUseCase,
    private deleteCommentUseCase: DeleteCommentUseCase,
    private userRepository: IUserRepository
  ) {}

  async add(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { videoLink, content } = req.body;
      const userId = req.user.userId;

      if (!videoLink || !content) {
        res.status(400).json({ error: 'Video link and content are required' });
        return;
      }

      // Get user information to include in comment
      const user = await this.userRepository.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const comment = await this.addCommentUseCase.execute(
        userId,
        videoLink,
        content,
        user.firstName,
        user.lastName,
        user.email
      );

      res.status(201).json({
        message: 'Comment added successfully',
        data: comment.toJSON(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: message });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { videoLink } = req.query;

      if (!videoLink || typeof videoLink !== 'string') {
        res.status(400).json({ error: 'Video link is required as query parameter' });
        return;
      }

      // Decode the video link in case it was encoded
      const decodedVideoLink = decodeURIComponent(videoLink);
      const comments = await this.listCommentsUseCase.execute(decodedVideoLink);

      res.status(200).json({
        message: 'Comments retrieved successfully',
        data: comments.map(comment => comment.toJSON()),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { commentId } = req.params;
      const { content } = req.body;
      const userId = req.user.userId;

      if (!commentId || !content) {
        res.status(400).json({ error: 'Comment ID and content are required' });
        return;
      }

      const comment = await this.updateCommentUseCase.execute(commentId, userId, content);

      res.status(200).json({
        message: 'Comment updated successfully',
        data: comment.toJSON(),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      const statusCode = message.includes('not found') || message.includes('only') ? 404 : 400;
      res.status(statusCode).json({ error: message });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { commentId } = req.params;
      const userId = req.user.userId;

      if (!commentId) {
        res.status(400).json({ error: 'Comment ID is required' });
        return;
      }

      const success = await this.deleteCommentUseCase.execute(commentId, userId);

      if (!success) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      const statusCode = message.includes('not found') || message.includes('only') ? 404 : 400;
      res.status(statusCode).json({ error: message });
    }
  }
}

