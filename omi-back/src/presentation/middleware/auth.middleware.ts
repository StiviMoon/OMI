import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { UserPayload } from '../../types';

/**
 * Extended Express Request interface for authenticated routes.
 * 
 * @interface
 * @extends {Request}
 */
export interface AuthenticatedRequest extends Request {
  /** Decoded user information extracted from the JWT token */
  user?: UserPayload;
}

/**
 * Middleware that verifies the presence and validity of a JWT access token.
 * 
 * This middleware checks the `Authorization` header for a Bearer token,
 * verifies it using the configured JWT secret, and attaches the decoded
 * user payload to the request object. If verification fails, it returns
 * an appropriate 401 Unauthorized response.
 * 
 * @function
 * @async
 * @param {AuthenticatedRequest} req - Express request object extended with optional user property.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function for passing control to the next middleware.
 * 
 * @example
 * // Example route using this middleware:
 * import { Router } from 'express';
 * import { authenticateToken } from '../middleware/auth.middleware';
 * 
 * const router = Router();
 * router.get('/profile', authenticateToken, (req, res) => {
 *   res.json({ user: req.user });
 * });
 * 
 * export default router;
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid token';
    res.status(401).json({ error: message });
  }
};
