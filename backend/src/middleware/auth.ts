import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, IJwtPayload } from '../utils/jwt';

/**
 * Extend Express Request to include user data
 */
export interface AuthRequest extends Request {
  user?: IJwtPayload;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user data to request
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'No authorization header provided',
      });
      return;
    }

    // Check if Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Invalid authorization header format. Expected: Bearer <token>',
      });
      return;
    }

    // Extract token
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided',
      });
      return;
    }

    // Verify token
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token';
      res.status(401).json({
        success: false,
        message,
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user data if token is valid, but doesn't require it
 */
export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      next();
      return;
    }

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    } catch {
      // Ignore errors for optional auth
    }

    next();
  } catch {
    next();
  }
};
