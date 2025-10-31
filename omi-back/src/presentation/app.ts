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
    // Configurar orígenes permitidos
    // Detectar producción por presencia de Render o por NODE_ENV
    const isProduction = config.nodeEnv === 'production' || process.env.RENDER;
    
    const allowedOrigins = isProduction
      ? [
          'https://omi-front.vercel.app',
          /^https:\/\/.*\.vercel\.app$/,
          'http://localhost:3000'
        ]
      : [
          config.cors.origin,
          'http://localhost:3000',
          'http://localhost:3001',
        ];

    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`🌍 Is Production: ${isProduction}`);
    console.log(`🌍 Allowed Origins:`, allowedOrigins);

    // Configuración de CORS más robusta
    const corsOptions = {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Permitir requests sin origen (ej: Postman, mobile apps, servidor a servidor)
        if (!origin) {
          console.log('✅ CORS: Request without origin allowed');
          return callback(null, true);
        }

        console.log(`🔍 CORS: Checking origin ${origin}`);

        // Verificar si el origen está permitido
        const isAllowed = allowedOrigins.some((allowedOrigin) => {
          if (typeof allowedOrigin === 'string') {
            return origin === allowedOrigin;
          }
          if (allowedOrigin instanceof RegExp) {
            return allowedOrigin.test(origin);
          }
          return false;
        });

        if (isAllowed) {
          console.log(`✅ CORS: Origin ${origin} allowed`);
          callback(null, true);
        } else {
          console.warn(`❌ CORS: Origin ${origin} not allowed. Allowed origins:`, allowedOrigins);
          // En lugar de lanzar error, rechazar silenciosamente
          callback(null, false);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      preflightContinue: false,
      optionsSuccessStatus: 204,
      maxAge: 86400, // 24 horas de cache para preflight
    };

    // Aplicar CORS antes que cualquier otra ruta
    this.app.use(cors(corsOptions));
    
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
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
