import { Comment } from '../entities/comment.entity';

export interface ICommentRepository {
  addComment(
    userId: string,
    videoLink: string,
    content: string,
    userFirstName?: string,
    userLastName?: string,
    userEmail?: string
  ): Promise<Comment>;
  getCommentsByVideo(videoLink: string): Promise<Comment[]>;
  getCommentById(commentId: string): Promise<Comment | null>;
  updateComment(commentId: string, userId: string, content: string): Promise<Comment>;
  deleteComment(commentId: string, userId: string): Promise<boolean>;
  getUserComments(userId: string): Promise<Comment[]>;
}

