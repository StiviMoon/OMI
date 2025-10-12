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
import { MongoUserRepository } from '../infrastructure/repositories/mongo-user.repository';
import { PexelsService } from '../infrastructure/services/pexels.service';

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
    const userRepository = new MongoUserRepository();
    const registerUseCase = new RegisterUseCase(userRepository);
    const loginUseCase = new LoginUseCase(userRepository);
    this.authController = new AuthController(registerUseCase, loginUseCase);

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

    this.app.get('/', (req, res) => {
      res.json({
        message: 'OMI API - Authentication & Video Services',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          videos: '/api/videos',
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