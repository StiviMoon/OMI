import express from 'express';
import cors from 'cors';
import { config } from '../config';
import { errorHandler } from './middleware/error.middleware';
import { createAuthRoutes } from './routes/auth.routes';
import { AuthController } from './controllers/auth.controller';
import { RegisterUseCase } from '../domain/use-cases/register.use-case';
import { LoginUseCase } from '../domain/use-cases/login.use-case';
import { MongoUserRepository } from '../infrastructure/repositories/mongo-user.repository';

export class App {
  private app: express.Application;
  private authController!: AuthController;

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

    this.app.get('/', (req, res) => {
      res.json({ message: 'OMI Auth API' });
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