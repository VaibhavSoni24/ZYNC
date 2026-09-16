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

  async updateUsername(userId: string, newUsername: string) {
    const normalized = newUsername.toLowerCase().trim();

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');

      if (user.usernameChangeCount >= 1) {
        throw new Error('Username can only be changed once per account');
      }

      if (user.username.toLowerCase() === normalized) {
        return formatUserDto(user);
      }

      const existing = await prisma.user.findFirst({
        where: {
          username: { equals: normalized, mode: 'insensitive' },
          NOT: { id: userId }
        }
      });

      if (existing) {
        throw new Error('Username is already taken by another user');
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          username: normalized,
          usernameChangeCount: { increment: 1 }
        }
      });

      return formatUserDto(updated);
    } catch (err: any) {
      if (err.message?.includes('only be changed once') || err.message?.includes('already taken')) {
        throw err;
      }
      throw new Error('Failed to update username');
    }
  }
}

export const usersService = new UsersService();
