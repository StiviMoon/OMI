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
import favoritesRoutes from './routes/favorites.routes';
import ratingsRoutes from './routes/ratings.routes';
import { FavoritesController } from './controllers/favorites.controller';
import { RatingsController } from './controllers/ratings.controller';


export class App {
  private app: express.Application;
  private authController!: AuthController;
  private pexelsController!: PexelsController;

  constructor() {
    this.app = express();
    this.setupDependencies();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupDependencies(): void {
    // Initialize repositories and services
    const userRepository = new MongoUserRepository();
    const emailService = new EmailService();

    // Initialize use cases
    const registerUseCase = new RegisterUseCase(userRepository);
    const loginUseCase = new LoginUseCase(userRepository);
    const updateProfileUseCase = new UpdateProfileUseCase(userRepository);
    const deleteAccountUseCase = new DeleteAccountUseCase(userRepository);
    const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService);
    const resetPasswordUseCase = new ResetPasswordUseCase(userRepository);

    // Initialize auth controller
    this.authController = new AuthController(
      registerUseCase,
      loginUseCase,
      updateProfileUseCase,
      deleteAccountUseCase,
      forgotPasswordUseCase,
      resetPasswordUseCase,
      userRepository
    );

    // Initialize pexels controller
    const pexelsService = new PexelsService();
    this.pexelsController = new PexelsController(pexelsService);
  }

  private setupMiddleware(): void {
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true
    }));
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    this.app.use('/api/auth', createAuthRoutes(this.authController));
    this.app.use('/api/videos', createPexelsRoutes(this.pexelsController));
    this.app.use('/api/favorites', favoritesRoutes);
    this.app.use('/api/ratings', ratingsRoutes);



    this.app.get('/', (req, res) => {
      res.json({
        message: 'OMI API - Authentication & Video Services',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          videos: '/api/videos',
          favorites: '/api/favorites',
          ratings: '/api/ratings',
        },
      });
    });
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