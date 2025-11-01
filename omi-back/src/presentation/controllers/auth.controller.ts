import { Request, Response } from 'express';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { UpdateProfileUseCase } from '../../domain/use-cases/update-profile.use-case';
import { DeleteAccountUseCase } from '../../domain/use-cases/delete-account.use-case';
import { ForgotPasswordUseCase } from '../../domain/use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from '../../domain/use-cases/reset-password.use-case';
import {
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../../types';
import { IUserRepository } from '../../domain/repositories/user.repository';

/**
 * Extended Request type for authenticated routes
 * Contains user information added by the authentication middleware
 * 
 * @interface AuthenticatedRequest
 * @extends {Request}
 * @property {Object} [user] - User information from JWT token
 * @property {string} [user.userId] - User ID from token
 * @property {string} [user.email] - User email from token
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * Controller for handling authentication-related HTTP requests
 * 
 * This controller manages all authentication operations including:
 * - User registration
 * - User login
 * - Profile management (get/update)
 * - Account deletion
 * - Password recovery (forgot/reset)
 * 
 * @class AuthController
 * 
 * @example
 * ```typescript
 * const authController = new AuthController(
 *   registerUseCase,
 *   loginUseCase,
 *   updateProfileUseCase,
 *   deleteAccountUseCase,
 *   forgotPasswordUseCase,
 *   resetPasswordUseCase,
 *   userRepository
 * );
 * ```
 */
export class AuthController {
  /**
   * Creates an instance of AuthController
   * 
   * @param {RegisterUseCase} registerUseCase - Use case for user registration
   * @param {LoginUseCase} loginUseCase - Use case for user login
   * @param {UpdateProfileUseCase} updateProfileUseCase - Use case for profile updates
   * @param {DeleteAccountUseCase} deleteAccountUseCase - Use case for account deletion
   * @param {ForgotPasswordUseCase} forgotPasswordUseCase - Use case for password recovery request
   * @param {ResetPasswordUseCase} resetPasswordUseCase - Use case for password reset
   * @param {IUserRepository} userRepository - Repository for user data access
   */
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private updateProfileUseCase: UpdateProfileUseCase,
    private deleteAccountUseCase: DeleteAccountUseCase,
    private forgotPasswordUseCase: ForgotPasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private userRepository: IUserRepository
  ) {}

  /**
   * Handles user registration requests
   * 
   * Validates required fields and creates a new user account.
   * Returns user data and JWT token upon successful registration.
   * 
   * @method register
   * @async
   * @param {Request<unknown, unknown, RegisterRequest>} req - Express request object
   * @param {RegisterRequest} req.body - Registration data
   * @param {string} req.body.email - User email address
   * @param {string} req.body.password - User password (will be hashed)
   * @param {string} req.body.firstName - User first name
   * @param {string} req.body.lastName - User last name
   * @param {number} req.body.age - User age (must be between 13 and 120)
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   * 
   * @throws {Error} 400 - If required fields are missing or validation fails
   * @throws {Error} 400 - If user already exists with the provided email
   * 
   * @example
   * ```typescript
   * POST /api/auth/register
   * Body: {
   *   "email": "user@example.com",
   *   "password": "password123",
   *   "firstName": "Juan",
   *   "lastName": "Pérez",
   *   "age": 25
   * }
   * 
   * Response: {
   *   "message": "User registered successfully",
   *   "data": {
   *     "user": { ... },
   *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *   }
   * }
   * ```
   */
  public register = async (req: Request<unknown, unknown, RegisterRequest>, res: Response): Promise<void> => {
    try {
      const { email, password, firstName, lastName, age } = req.body;
      
      if (!email || !password || !firstName || !lastName || age === undefined) {
        res.status(400).json({ 
          error: 'Email, password, first name, last name, and age are required' 
        });
        return;
      }

      const result = await this.registerUseCase.execute(
        email,
        password,
        firstName,
        lastName,
        age
      );
      
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
   * Handles user login requests
   * 
   * Authenticates user credentials and returns JWT token for subsequent requests.
   * 
   * @method login
   * @async
   * @param {Request<unknown, unknown, LoginRequest>} req - Express request object
   * @param {LoginRequest} req.body - Login credentials
   * @param {string} req.body.email - User email address
   * @param {string} req.body.password - User password (plain text)
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   * 
   * @throws {Error} 400 - If email or password is missing
   * @throws {Error} 401 - If credentials are invalid
   * 
   * @example
   * ```typescript
   * POST /api/auth/login
   * Body: {
   *   "email": "user@example.com",
   *   "password": "password123"
   * }
   * 
   * Response: {
   *   "message": "Login successful",
   *   "data": {
   *     "user": { ... },
   *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *   }
   * }
   * ```
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
   * Retrieves the authenticated user's profile
   * 
   * Returns user information based on the JWT token in the Authorization header.
   * Requires authentication middleware.
   * 
   * @method getProfile
   * @async
   * @param {AuthenticatedRequest} req - Express request with user info from JWT
   * @param {Response} res - Express response object
   * @returns {Promise<void>}
   * 
   * @throws {Error} 401 - If user is not authenticated
   * @throws {Error} 404 - If user is not found in database
   * @throws {Error} 500 - If database query fails
   * 
   * @example
   * ```typescript
   * GET /api/auth/profile
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   * 
   * Response: {
   *   "message": "Profile retrieved successfully",
   *   "data": {
   *     "user": {
   *       "id": "...",
   *       "email": "user@example.com",
   *       "firstName": "Juan",
   *       "lastName": "Pérez",
   *       "age": 25,
   *       "createdAt": "...",
   *       "updatedAt": "..."
   *     }
   *   }
   * }
   * ```
   */
  public getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const user = await this.userRepository.findById(req.user.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({
        message: 'Profile retrieved successfully',
        data: { user: user.toJSON() },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ error: message });
    }
  };

  public updateProfile = async (
    req: Request<unknown, unknown, UpdateProfileRequest> & AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { firstName, lastName, age, email, currentPassword, newPassword } = req.body;

      const updateData = {
        firstName,
        lastName,
        age,
        email,
        password: newPassword,
      };

      const result = await this.updateProfileUseCase.execute(
        req.user.userId,
        updateData,
        currentPassword
      );

      res.status(200).json({
        message: 'Profile updated successfully',
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: message });
    }
  };

  public deleteAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { password } = req.body;

      if (!password) {
        res.status(400).json({ error: 'Password is required' });
        return;
      }

      const result = await this.deleteAccountUseCase.execute(req.user.userId, password);

      res.status(200).json({
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: message });
    }
  };

  public forgotPassword = async (
    req: Request<unknown, unknown, ForgotPasswordRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ error: 'Email is required' });
        return;
      }

      const result = await this.forgotPasswordUseCase.execute(email);

      res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: message });
    }
  };

  public resetPassword = async (
    req: Request<unknown, unknown, ResetPasswordRequest>,
    res: Response
  ): Promise<void> => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        res.status(400).json({ error: 'Token and new password are required' });
        return;
      }

      const result = await this.resetPasswordUseCase.execute(token, newPassword);

      res.status(200).json({
        message: result.message,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ error: message });
    }
  };
}
