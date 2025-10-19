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

// Extended Request types for authenticated routes
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private updateProfileUseCase: UpdateProfileUseCase,
    private deleteAccountUseCase: DeleteAccountUseCase,
    private forgotPasswordUseCase: ForgotPasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private userRepository: IUserRepository
  ) {}

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
