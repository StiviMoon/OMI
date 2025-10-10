import { Request, Response } from 'express';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase
  ) {}

  public register = async (req: Request, res: Response) => {
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
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  public login = async (req: Request, res: Response) => {
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
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  };

  public getProfile = async (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: { user: (req as any).user },
    });
  };
}
