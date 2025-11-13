import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, workshop_profile } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
      return;
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password_hash: password, // Will be hashed by pre-save hook
      name,
      workshop_profile: workshop_profile || undefined,
    });

    await user.save();

    // Generate tokens
    const tokens = generateTokens({
      userId: (user._id as any).toString(),
      email: user.email,
    });

    // Return user data and tokens
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id as any,
          email: user.email,
          name: user.name,
          workshop_profile: user.workshop_profile,
          created_at: user.created_at,
        },
        ...tokens,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: (user._id as any).toString(),
      email: user.email,
    });

    // Return user data and tokens
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id as any,
          email: user.email,
          name: user.name,
          workshop_profile: user.workshop_profile,
          created_at: user.created_at,
        },
        ...tokens,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Invalid refresh token',
      });
      return;
    }

    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: (user._id as any).toString(),
      email: user.email,
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id as any,
          email: user.email,
          name: user.name,
          workshop_profile: user.workshop_profile,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const { name, workshop_profile } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Update fields
    if (name) user.name = name;
    if (workshop_profile) user.workshop_profile = workshop_profile;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id as any,
          email: user.email,
          name: user.name,
          workshop_profile: user.workshop_profile,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
