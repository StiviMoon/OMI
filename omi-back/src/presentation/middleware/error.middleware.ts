import { Request, Response, NextFunction } from 'express';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', error.message);
  
  res.status(500).json({
    error: error.message || 'Internal server error'
  });
};
