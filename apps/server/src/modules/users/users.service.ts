import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma';
import { UserDto } from '@zync/shared';
import { logger } from '../../utils/logger';

function formatUserDto(user: any): UserDto {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    avatar: user.avatar || 'Comet',
    bio: user.bio || null,
    dob: user.dob,
    usernameChangeCount: user.usernameChangeCount || 0,
    lastUsernameChangedAt: user.lastUsernameChangedAt instanceof Date
      ? user.lastUsernameChangedAt.toISOString()
      : (user.lastUsernameChangedAt || null),
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt
  };
}

export class UsersService {
  async updateProfile(userId: string, data: { name?: string; avatar?: string; bio?: string; dob?: string }) {
    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.name && { name: data.name.trim() }),
          ...(data.avatar && { avatar: data.avatar }),
          ...(data.bio !== undefined && { bio: data.bio ? data.bio.trim() : null }),
          ...(data.dob && { dob: data.dob })
        }
      });
      return formatUserDto(updated);
    } catch (err: any) {
      logger.warn('Prisma updateProfile fallback:', err.message);
      throw new Error('Could not update profile');
    }
  }

  async checkUsernameAvailability(userId: string, requestedUsername: string) {
    const normalized = requestedUsername.toLowerCase().trim();

    if (!normalized || normalized.length < 3 || normalized.length > 20) {
      return { available: false, message: 'Username must be 3-20 characters' };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(normalized)) {
      return { available: false, message: 'Letters, numbers, and underscores only' };
    }

    try {
      const existing = await prisma.user.findFirst({
        where: {
          username: { equals: normalized, mode: 'insensitive' },
          NOT: { id: userId }
        }
      });

      if (existing) {
        return { available: false, message: 'Username is already taken' };
      }

      return { available: true, message: 'Username is available!' };
    } catch (err: any) {
      logger.warn('checkUsernameAvailability fallback:', err.message);
      return { available: true, message: 'Username format is valid' };
    }
  }

  async updateUsername(userId: string, newUsername: string, passwordVerify: string) {
    const normalized = newUsername.toLowerCase().trim();

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');

      // 1. Password Verification (Required for security)
      if (!passwordVerify || !passwordVerify.trim()) {
        throw new Error('Current password verification is required to change your username');
      }

      const isPasswordValid = await bcrypt.compare(passwordVerify, user.passwordHash);
      if (!isPasswordValid) {
        throw new Error('Incorrect password. Please verify your current password to continue.');
      }

      // If user submitted their current username
      if (user.username.toLowerCase() === normalized) {
        return formatUserDto(user);
      }

      // 2. Monthly Cooldown (Once per month / 30 days)
      const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
      const lastChanged = user.lastUsernameChangedAt || (user.usernameChangeCount > 0 ? user.updatedAt : null);

      if (lastChanged) {
        const elapsed = Date.now() - new Date(lastChanged).getTime();
        if (elapsed < ONE_MONTH_MS) {
          const nextAvailable = new Date(new Date(lastChanged).getTime() + ONE_MONTH_MS);
          const daysLeft = Math.ceil((nextAvailable.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
          throw new Error(
            `Username can only be updated once per month. You can update it again in ${daysLeft} day${daysLeft === 1 ? '' : 's'} (${nextAvailable.toLocaleDateString()}).`
          );
        }
      }

      // 3. Uniqueness Check (Only if available)
      const existing = await prisma.user.findFirst({
        where: {
          username: { equals: normalized, mode: 'insensitive' },
          NOT: { id: userId }
        }
      });

      if (existing) {
        throw new Error(`Username @${normalized} is already taken by another user`);
      }

      // 4. Update with resilient fallback for lastUsernameChangedAt
      let updated: any;
      try {
        updated = await prisma.user.update({
          where: { id: userId },
          data: {
            username: normalized,
            usernameChangeCount: { increment: 1 },
            lastUsernameChangedAt: new Date()
          }
        });
      } catch (colErr: any) {
        // Fallback if column not yet applied on remote DB
        logger.warn('Fallback username update without lastUsernameChangedAt:', colErr.message);
        updated = await prisma.user.update({
          where: { id: userId },
          data: {
            username: normalized,
            usernameChangeCount: { increment: 1 }
          }
        });
      }

      return formatUserDto(updated);
    } catch (err: any) {
      if (
        err.message?.includes('once per month') ||
        err.message?.includes('already taken') ||
        err.message?.includes('password') ||
        err.message?.includes('User not found')
      ) {
        throw err;
      }
      logger.error('Failed to update username:', err);
      throw new Error('Failed to update username. Please try again.');
    }
  }
}

export const usersService = new UsersService();
