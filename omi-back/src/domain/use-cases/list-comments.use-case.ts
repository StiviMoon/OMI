import { ICommentRepository } from '../repositories/comment.repository';
import { Comment } from '../entities/comment.entity';

export class ListCommentsUseCase {
  constructor(private commentRepo: ICommentRepository) {}

  async execute(videoLink: string): Promise<Comment[]> {
    if (!videoLink || videoLink.trim().length === 0) {
      throw new Error('Video link is required');
    }

    return this.commentRepo.getCommentsByVideo(videoLink);
  }
}

