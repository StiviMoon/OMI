import { Request, Response, NextFunction } from 'express';

/**
 * Custom application error class for consistent error handling.
 * 
 * This class allows distinguishing between operational errors (expected, user-related)
 * and programmer errors (unexpected, system-related) by including a status code
 * and an operational flag.
 * 
 * @class
 * @extends {Error}
 */
export class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * 
   * @param {number} statusCode - HTTP status code associated with the error.
   * @param {string} message - Descriptive error message.
   * @param {boolean} [isOperational=true] - Indicates if the error is operational (user-related).
   * 
   * @example
   * throw new AppError(404, 'User not found');
   */
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

/**
 * Global Express error-handling middleware.
 * 
 * This middleware captures and logs all unhandled exceptions or rejections
 * that occur during request processing. It differentiates between known
 * operational errors (instances of AppError) and unexpected ones, returning
 * structured JSON responses accordingly.
 * 
 * @function
 * @param {Error|AppError} error - The error object thrown during request handling.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send the error response.
 * @param {NextFunction} next - Express next function (not used, but required for middleware signature).
 * 
 * @example
 * import express from 'express';
 * import { errorHandler, AppError } from './middleware/error.middleware';
 * 
 * const app = express();
 * 
 * // Example route throwing a custom error
 * app.get('/example', (req, res) => {
 *   throw new AppError(400, 'Invalid input data');
 * });
 * 
 * // Global error handler
 * app.use(errorHandler);
 */
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);

  // Handle custom operational errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
    return;
  }

  // Handle unknown or generic errors
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error',
  });
};
