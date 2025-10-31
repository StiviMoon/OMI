import { ICommentRepository } from '../repositories/comment.repository';

export class DeleteCommentUseCase {
  constructor(private commentRepo: ICommentRepository) {}

  async execute(commentId: string, userId: string): Promise<boolean> {
    // Verify the comment exists and belongs to the user
    const existingComment = await this.commentRepo.getCommentById(commentId);
    if (!existingComment) {
      throw new Error('Comment not found');
    }

    if (existingComment.userId !== userId) {
      throw new Error('You can only delete your own comments');
    }

    return this.commentRepo.deleteComment(commentId, userId);
  }
}

