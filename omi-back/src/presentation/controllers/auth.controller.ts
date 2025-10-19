import { Request, Response } from 'express';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { RegisterRequest, LoginRequest } from '../../types';

/**
 * Extended Express request interface for authenticated routes.
 * 
 * @interface
 * @extends {Request}
 */
export interface AuthenticatedRequest extends Request {
  /** Authenticated user payload extracted from JWT token */
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * Controller responsible for handling user authentication operations.
 * 
 * This controller bridges the Express HTTP layer with domain use cases,
 * managing user registration, login, and profile retrieval.
 */
export class AuthController {
  /**
   * Creates an instance of AuthController.
   * 
   * @param {RegisterUseCase} registerUseCase - Use case responsible for user registration.
   * @param {LoginUseCase} loginUseCase - Use case responsible for user login.
   */
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase
  ) {}

  /**
   * Handles user registration requests.
   * 
   * Validates the input, executes the registration use case, and returns
   * a JSON response containing the newly created user and authentication token.
   * 
   * @async
   * @param {Request<unknown, unknown, RegisterRequest>} req - Express request containing email and password in the body.
   * @param {Response} res - Express response used to send status and data.
   * @returns {Promise<void>} A promise that resolves once the response is sent.
   * 
   * @example
   * POST /api/auth/register
   * Body: { "email": "test@example.com", "password": "password123" }
   */
  public register = async (req: Request<unknown, unknown, RegisterRequest>, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await this.registerUseCase.execute(email, password);

      res.status(201).json({
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: message });
    }
  };

  /**
   * Handles user login requests.
   * 
   * Verifies user credentials using the LoginUseCase, and returns
   * an authentication token along with user information.
   * 
   * @async
   * @param {Request<unknown, unknown, LoginRequest>} req - Express request containing login credentials.
   * @param {Response} res - Express response used to send status and data.
   * @returns {Promise<void>} A promise that resolves once the response is sent.
   * 
   * @example
   * POST /api/auth/login
   * Body: { "email": "test@example.com", "password": "password123" }
   */
  public login = async (req: Request<unknown, unknown, LoginRequest>, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const result = await this.loginUseCase.execute(email, password);

      res.status(200).json({
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(401).json({ error: message });
    }
  };

  /**
   * Retrieves the authenticated user's profile information.
   * 
   * Requires a valid JWT token attached to the request (decoded via middleware).
   * 
   * @async
   * @param {AuthenticatedRequest} req - Authenticated request object containing decoded user data.
   * @param {Response} res - Express response used to send the profile data.
   * @returns {Promise<void>} A promise that resolves once the response is sent.
   * 
   * @example
   * GET /api/auth/profile
   * Headers: { "Authorization": "Bearer <token>" }
   */
  public getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: { user: req.user },
    });
  };
}
