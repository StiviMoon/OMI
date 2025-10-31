import { ICommentRepository } from '../repositories/comment.repository';
import { Comment } from '../entities/comment.entity';

export class AddCommentUseCase {
  constructor(private commentRepo: ICommentRepository) {}

  async execute(
    userId: string,
    videoLink: string,
    content: string,
    userFirstName?: string,
    userLastName?: string,
    userEmail?: string
  ): Promise<Comment> {
    if (!content || content.trim().length === 0) {
      throw new Error('Comment content cannot be empty');
    }

    if (content.length > 1000) {
      throw new Error('Comment content cannot exceed 1000 characters');
    }

    return this.commentRepo.addComment(
      userId,
      videoLink,
      content.trim(),
      userFirstName,
      userLastName,
      userEmail
    );
  }
}

