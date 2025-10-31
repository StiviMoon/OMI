import { ICommentRepository } from '../repositories/comment.repository';
import { Comment } from '../entities/comment.entity';

export class UpdateCommentUseCase {
  constructor(private commentRepo: ICommentRepository) {}

  async execute(commentId: string, userId: string, content: string): Promise<Comment> {
    if (!content || content.trim().length === 0) {
      throw new Error('Comment content cannot be empty');
    }

    if (content.length > 1000) {
      throw new Error('Comment content cannot exceed 1000 characters');
    }

    // Verify the comment exists and belongs to the user
    const existingComment = await this.commentRepo.getCommentById(commentId);
    if (!existingComment) {
      throw new Error('Comment not found');
    }

    if (existingComment.userId !== userId) {
      throw new Error('You can only update your own comments');
    }

    return this.commentRepo.updateComment(commentId, userId, content.trim());
  }
}

