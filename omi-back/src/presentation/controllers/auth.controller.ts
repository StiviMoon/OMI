import { Request, Response } from 'express';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { RegisterRequest, LoginRequest } from '../../types';

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
    private loginUseCase: LoginUseCase
  ) {}

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
    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: { user: req.user },
    });
  };
}
