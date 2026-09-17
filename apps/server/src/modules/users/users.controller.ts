import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { usersService } from './users.service';
import { AuthenticatedRequest } from '../../middleware/auth';

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  avatar: z.string().optional(),
  bio: z.string().max(100).optional(),
  dob: z.string().optional()
});

const updateUsernameSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(1, 'Password verification is required')
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

const deleteAccountSchema = z.object({
  password: z.string().optional(),
  otp: z.string().optional()
});

export class UsersController {
  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      const validated = updateProfileSchema.parse(req.body);
      const user = await usersService.updateProfile(req.user.userId, validated);
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async checkUsername(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      const username = (req.query.username as string) || '';
      const result = await usersService.checkUsernameAvailability(req.user.userId, username);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async updateUsername(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      const { username, password } = updateUsernameSchema.parse(req.body);
      const user = await usersService.updateUsername(req.user.userId, username, password);
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, _next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      const result = await usersService.changePassword(req.user.userId, currentPassword, newPassword);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to update password' });
    }
  }

  async requestDeleteOtp(req: AuthenticatedRequest, res: Response, _next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      const result = await usersService.requestDeleteAccountOtp(req.user.userId);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to request deletion code' });
    }
  }

  async deleteAccount(req: AuthenticatedRequest, res: Response, _next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Authentication required' });
        return;
      }

      const { password, otp } = deleteAccountSchema.parse(req.body);
      if (!password && !otp) {
        res.status(400).json({ success: false, error: 'Account password or email verification code is required.' });
        return;
      }

      const result = await usersService.deleteAccount(req.user.userId, { password, otp });
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message || 'Failed to delete account' });
    }
  }
}

export const usersController = new UsersController();

