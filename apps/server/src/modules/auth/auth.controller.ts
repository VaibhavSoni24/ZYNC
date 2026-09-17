import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from './auth.service';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  REFRESH_TOKEN_COOKIE_NAME
} from '../../utils/jwt';
import { AuthenticatedRequest } from '../../middleware/auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  dob: z.string().min(4, 'Date of birth is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  avatar: z.string().optional(),
  bio: z.string().max(100, 'Bio must be under 100 characters').optional()
});

const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'Verification code must be 6 digits')
});

const resendOtpSchema = z.object({
  email: z.string().email('Invalid email address')
});

const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required')
});

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await authService.register(validated);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = verifyOtpSchema.parse(req.body);
      const result = await authService.verifyAndCreateUser(email, otp);

      setRefreshTokenCookie(res, result.refreshToken);

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = resendOtpSchema.parse(req.body);
      const result = await authService.resendOtp(email);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { identifier, password } = loginSchema.parse(req.body);
      const result = await authService.login(identifier, password);

      setRefreshTokenCookie(res, result.refreshToken);

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] || req.body?.refreshToken;
      if (!token) {
        res.status(401).json({ success: false, error: 'No refresh token provided' });
        return;
      }

      const payload = verifyRefreshToken(token);
      if (!payload) {
        clearRefreshTokenCookie(res);
        res.status(401).json({ success: false, error: 'Invalid or expired refresh token' });
        return;
      }

      const user = await authService.getUserById(payload.userId);
      if (!user) {
        clearRefreshTokenCookie(res);
        res.status(401).json({ success: false, error: 'User no longer exists' });
        return;
      }

      const tokenPayload = {
        userId: user.id,
        username: user.username,
        email: user.email
      };

      const newAccessToken = signAccessToken(tokenPayload);
      const newRefreshToken = signRefreshToken(tokenPayload);

      setRefreshTokenCookie(res, newRefreshToken);

      res.status(200).json({
        success: true,
        data: {
          accessToken: newAccessToken,
          user
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(_req: Request, res: Response) {
    clearRefreshTokenCookie(res);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Not authenticated' });
        return;
      }

      const user = await authService.getUserById(req.user.userId);
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, _next: NextFunction) {
    try {
      const { identifier } = req.body;
      if (!identifier || typeof identifier !== 'string') {
        res.status(400).json({ success: false, error: 'Username or email address is required' });
        return;
      }
      const result = await authService.requestForgotPasswordOtp(identifier);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to request password reset' });
    }
  }

  async resendResetOtp(req: Request, res: Response, _next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        res.status(400).json({ success: false, error: 'Email address is required' });
        return;
      }
      const result = await authService.resendResetOtp(email);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to resend reset code' });
    }
  }

  async resetPassword(req: Request, res: Response, _next: NextFunction) {
    try {
      const { email, otp, newPassword } = req.body;
      if (!email || !otp || !newPassword) {
        res.status(400).json({ success: false, error: 'Email, verification code, and new password are required' });
        return;
      }
      const result = await authService.resetPassword(email, otp, newPassword);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to reset password' });
    }
  }
}

export const authController = new AuthController();

