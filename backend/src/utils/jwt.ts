import jwt from 'jsonwebtoken';

/**
 * JWT Payload Interface
 */
export interface IJwtPayload {
  userId: string;
  email: string;
}

/**
 * Token Response Interface
 */
export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/**
 * Generate access token
 */
export const generateAccessToken = (payload: IJwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: IJwtPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (payload: IJwtPayload): ITokenResponse => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): IJwtPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret) as IJwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    throw error;
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): IJwtPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }

  try {
    const decoded = jwt.verify(token, secret) as IJwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string): IJwtPayload | null => {
  try {
    return jwt.decode(token) as IJwtPayload;
  } catch {
    return null;
  }
};
