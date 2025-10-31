import express from 'express';
import cors from 'cors';
import { config } from '../config';
import { errorHandler } from './middleware/error.middleware';
import { createAuthRoutes } from './routes/auth.routes';
import { createPexelsRoutes } from './routes/pexels.routes';
import { AuthController } from './controllers/auth.controller';
import { PexelsController } from './controllers/pexels.controller';
import { RegisterUseCase } from '../domain/use-cases/register.use-case';
import { LoginUseCase } from '../domain/use-cases/login.use-case';
import { UpdateProfileUseCase } from '../domain/use-cases/update-profile.use-case';
import { DeleteAccountUseCase } from '../domain/use-cases/delete-account.use-case';
import { ForgotPasswordUseCase } from '../domain/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '../domain/use-cases/reset-password.use-case';
import { MongoUserRepository } from '../infrastructure/repositories/mongo-user.repository';
import { PexelsService } from '../infrastructure/services/pexels.service';
import { EmailService } from '../infrastructure/services/email.service';
import { FavoritesController } from './controllers/favorites.controller';
import { RatingsController } from './controllers/ratings.controller';
import { MongoFavoriteRepository } from '../infrastructure/repositories/mongo-favorite.repository';
import { RatingRepositoryImpl } from '../infrastructure/repositories/mongo-rating.repository';
import { ListFavoritesUseCase } from '../domain/use-cases/list-favorite.use-case';
import { AddFavoriteUseCase } from '../domain/use-cases/add-favorite.use-case';
import { RemoveFavoriteUseCase } from '../domain/use-cases/remove-favorite.use-case';
import { IsFavoriteUseCase } from '../domain/use-cases/is-favorite.use-case';
import { GetRatingsUseCase } from '../domain/use-cases/get.rating.use-case';
import { AddRatingUseCase } from '../domain/use-cases/add-rating.use-case';
import { UpdateRatingUseCase } from '../domain/use-cases/update-rating.use-case';
import { DeleteRatingUseCase } from '../domain/use-cases/delete-rating.use-case';
import { AddCommentUseCase } from '../domain/use-cases/add-comment.use-case';
import { ListCommentsUseCase } from '../domain/use-cases/list-comments.use-case';
import { UpdateCommentUseCase } from '../domain/use-cases/update-comment.use-case';
import { DeleteCommentUseCase } from '../domain/use-cases/delete-comment.use-case';
import { MongoCommentRepository } from '../infrastructure/repositories/mongo-comment.repository';
import { CommentsController } from './controllers/comments.controller';
import createFavoritesRoutes from './routes/favorites.routes';
import createRatingsRoutes from './routes/ratings.routes';
import createCommentsRoutes from './routes/comments.routes';

export class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupRoutes(): void {
    // Repositories
    const userRepository = new MongoUserRepository();
    const favoriteRepository = new MongoFavoriteRepository();
    const ratingRepository = new RatingRepositoryImpl();
    const commentRepository = new MongoCommentRepository();

    // Services
    const emailService = new EmailService();
    const pexelsService = new PexelsService();

    // Auth use cases
    const registerUseCase = new RegisterUseCase(userRepository);
    const loginUseCase = new LoginUseCase(userRepository);
    const updateProfileUseCase = new UpdateProfileUseCase(userRepository);
    const deleteAccountUseCase = new DeleteAccountUseCase(userRepository);
    const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService);
    const resetPasswordUseCase = new ResetPasswordUseCase(userRepository);

    // Favorites use cases
    const listFavoritesUseCase = new ListFavoritesUseCase(favoriteRepository);
    const addFavoriteUseCase = new AddFavoriteUseCase(favoriteRepository);
    const removeFavoriteUseCase = new RemoveFavoriteUseCase(favoriteRepository);
    const isFavoriteUseCase = new IsFavoriteUseCase(favoriteRepository);

    // Ratings use cases
    const getRatingsUseCase = new GetRatingsUseCase(ratingRepository);
    const addRatingUseCase = new AddRatingUseCase(ratingRepository);
    const updateRatingUseCase = new UpdateRatingUseCase(ratingRepository);
    const deleteRatingUseCase = new DeleteRatingUseCase(ratingRepository);

    // Comments use cases
    const addCommentUseCase = new AddCommentUseCase(commentRepository);
    const listCommentsUseCase = new ListCommentsUseCase(commentRepository);
    const updateCommentUseCase = new UpdateCommentUseCase(commentRepository);
    const deleteCommentUseCase = new DeleteCommentUseCase(commentRepository);

    // Controllers
    const authController = new AuthController(
      registerUseCase,
      loginUseCase,
      updateProfileUseCase,
      deleteAccountUseCase,
      forgotPasswordUseCase,
      resetPasswordUseCase,
      userRepository
    );

    const pexelsController = new PexelsController(pexelsService);

    const favoritesController = new FavoritesController(
      listFavoritesUseCase,
      addFavoriteUseCase,
      removeFavoriteUseCase,
      isFavoriteUseCase
    );

    const ratingsController = new RatingsController(
      getRatingsUseCase,
      addRatingUseCase,
      updateRatingUseCase,
      deleteRatingUseCase
    );

    const commentsController = new CommentsController(
      addCommentUseCase,
      listCommentsUseCase,
      updateCommentUseCase,
      deleteCommentUseCase,
      userRepository
    );

    // Setup routes
    this.app.use('/api/auth', createAuthRoutes(authController));
    this.app.use('/api/videos', createPexelsRoutes(pexelsController));
    this.app.use('/api/favorites', createFavoritesRoutes(favoritesController));
    this.app.use('/api/ratings', createRatingsRoutes(ratingsController));
    this.app.use('/api/comments', createCommentsRoutes(commentsController));

    this.app.get('/', (req, res) => {
      res.json({
        message: 'OMI API - Authentication & Video Services',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          videos: '/api/videos',
          favorites: '/api/favorites',
          ratings: '/api/ratings',
          comments: '/api/comments',
        },
      });
    });
  }

  private setupMiddleware(): void {
    const allowedOrigins = config.nodeEnv === 'production'
      ? [
          'https://omi-front.vercel.app',
          /^https:\/\/.*\.vercel\.app$/,
          'http://localhost:3000'
        ]
      : config.cors.origin;

    this.app.use(cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    this.app.use(express.json());
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public getApp(): express.Application {
    return this.app;
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  }
}
