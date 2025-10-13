import { Request, Response, NextFunction } from 'express';

// Custom error class for better error handling
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  
  // Handle custom AppError
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
    return;
  }

  // Handle generic errors
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error',
  });
};
