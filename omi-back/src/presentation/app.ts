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

/**
 * Main application class that sets up and configures the Express server.
 * 
 * This class initializes middleware, routes, controllers, and error handling.
 * It also configures core dependencies following the principles of Clean Architecture.
 * 
 * @class
 */
export class App {
  /** Express application instance */
  private app: express.Application;

  /** Controller handling authentication logic */
  private authController!: AuthController;

  /** Controller handling video-related endpoints */
  private pexelsController!: PexelsController;

  /**
   * Creates an instance of the App class.
   * 
   * Automatically initializes dependencies, middleware, routes, and global error handling.
   * 
   * @example
   * import { App } from './presentation/app';
   * 
   * const application = new App();
   * application.listen();
   */
  constructor() {
    this.app = express();
    this.setupDependencies();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Sets up the application’s core dependencies.
   * 
   * Instantiates repositories, use cases, and controllers,
   * wiring them together for dependency injection.
   * 
   * @private
   * @returns {void}
   */
  private setupDependencies(): void {
    const userRepository = new MongoUserRepository();
    const registerUseCase = new RegisterUseCase(userRepository);
    const loginUseCase = new LoginUseCase(userRepository);
    this.authController = new AuthController(registerUseCase, loginUseCase);

    const pexelsService = new PexelsService();
    this.pexelsController = new PexelsController(pexelsService);
  }

  /**
   * Configures global Express middleware.
   * 
   * Enables CORS and JSON body parsing.
   * 
   * @private
   * @returns {void}
   */
  private setupMiddleware(): void {
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true,
    }));
    this.app.use(express.json());
  }

  /**
   * Defines and registers all application routes.
   * 
   * Includes routes for authentication, video management, and
   * a base route for health checks or API metadata.
   * 
   * @private
   * @returns {void}
   * 
   * @example
   * GET / -> Returns API metadata and available endpoints.
   * GET /api/auth -> Authentication endpoints (register, login, profile).
   * GET /api/videos -> Video endpoints (search, popular, get by ID).
   */
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

  /**
   * Registers the global error handling middleware.
   * 
   * @private
   * @returns {void}
   */
  private setupErrorHandling(): void {
    this.app.use(errorHandler);
  }

  /**
   * Retrieves the underlying Express application instance.
   * 
   * Useful for integration testing or for mounting in a parent server.
   * 
   * @public
   * @returns {express.Application} The Express app instance.
   */
  public getApp(): express.Application {
    return this.app;
  }

  /**
   * Starts the Express server on the configured port.
   * 
   * Logs a message to the console when the server is successfully running.
   * 
   * @public
   * @returns {void}
   * 
   * @example
   * const app = new App();
   * app.listen(); // Starts server on the configured port
   */
  public listen(): void {
    this.app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  }
}
