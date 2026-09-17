import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma';
import { UserDto } from '@zync/shared';
import {
  generateNumericOtp,
  storeOtp,
  verifyOtp,
  isOtpInCooldown,
  PendingRegistrationData
} from '../../utils/otp';
import { sendEmail, generateOtpEmailHtml } from '../../utils/brevo';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import { logger } from '../../utils/logger';

// In-memory fallback user store for local offline development if Postgres isn't running
const inMemoryUsers = new Map<string, any>();

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

export class AuthService {
  async register(params: {
    name: string;
    username: string;
    email: string;
    dob: string;
    password: string;
    avatar?: string;
    bio?: string;
  }) {
    const normalizedEmail = params.email.toLowerCase().trim();
    const normalizedUsername = params.username.toLowerCase().trim();

    // Check if user already exists
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: normalizedEmail },
            { username: normalizedUsername }
          ]
        }
      });

      if (existingUser) {
        if (existingUser.email === normalizedEmail) {
          throw new Error('An account with this email address already exists');
        }
        if (existingUser.username.toLowerCase() === normalizedUsername) {
          throw new Error('This username is already taken. Please choose another');
        }
      }
    } catch (err: any) {
      if (!err.message?.includes('already exists') && !err.message?.includes('already taken')) {
        logger.warn('Prisma query failed, checking in-memory user store:', err.message);
        for (const u of inMemoryUsers.values()) {
          if (u.email === normalizedEmail) throw new Error('An account with this email address already exists');
          if (u.username.toLowerCase() === normalizedUsername) throw new Error('This username is already taken');
        }
      } else {
        throw err;
      }
    }

    // Check OTP cooldown
    const { inCooldown, remainingSeconds } = await isOtpInCooldown(normalizedEmail);
    if (inCooldown) {
      throw new Error(`Please wait ${remainingSeconds} seconds before requesting a new verification code.`);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(params.password, 10);

    // Generate 6-digit OTP
    const otp = generateNumericOtp(6);

    const pendingData: PendingRegistrationData = {
      name: params.name.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      dob: params.dob,
      passwordHash,
      avatar: params.avatar || 'Comet',
      bio: params.bio?.trim()
    };

    // Store in Redis (ephemeral data, 10 min TTL)
    await storeOtp(normalizedEmail, otp, pendingData);

    // Send email via Brevo
    const emailHtml = generateOtpEmailHtml(otp, params.name.trim());
    await sendEmail({
      toEmail: normalizedEmail,
      toName: params.name.trim(),
      subject: 'Your Zync Verification Code',
      htmlContent: emailHtml
    });

    return {
      message: 'Verification code sent to your email',
      email: normalizedEmail,
      expiresInMinutes: 10
    };
  }

  async verifyAndCreateUser(email: string, otp: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await verifyOtp(normalizedEmail, otp);

    if (!result.success || !result.userData) {
      throw new Error(result.message || 'Invalid or expired verification code');
    }

    const data = result.userData;
    let userRecord: any;

    try {
      userRecord = await prisma.user.create({
        data: {
          name: data.name,
          username: data.username,
          email: data.email,
          dob: data.dob,
          passwordHash: data.passwordHash,
          avatar: data.avatar,
          bio: data.bio || null
        }
      });
    } catch (err: any) {
      logger.warn('Prisma creation fallback to in-memory store:', err.message);
      const fakeId = 'usr_' + Math.random().toString(36).substring(2, 10);
      userRecord = {
        id: fakeId,
        name: data.name,
        username: data.username,
        email: data.email,
        dob: data.dob,
        passwordHash: data.passwordHash,
        avatar: data.avatar,
        bio: data.bio || null,
        usernameChangeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryUsers.set(userRecord.id, userRecord);
    }

    const payload = {
      userId: userRecord.id,
      username: userRecord.username,
      email: userRecord.email
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return {
      user: formatUserDto(userRecord),
      accessToken,
      refreshToken
    };
  }

  async resendOtp(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const { inCooldown, remainingSeconds } = await isOtpInCooldown(normalizedEmail);
    if (inCooldown) {
      throw new Error(`Please wait ${remainingSeconds} seconds before requesting a new code.`);
    }

    const otp = generateNumericOtp(6);
    await storeOtp(normalizedEmail, otp);

    const emailHtml = generateOtpEmailHtml(otp, 'there');
    await sendEmail({
      toEmail: normalizedEmail,
      subject: 'Your New Zync Verification Code',
      htmlContent: emailHtml
    });

    return {
      message: 'A new verification code has been dispatched',
      email: normalizedEmail
    };
  }

  async login(identifier: string, password: string) {
    const normalized = identifier.toLowerCase().trim();
    let user: any;

    try {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: normalized },
            { username: normalized }
          ]
        }
      });
    } catch (err: any) {
      logger.warn('Prisma findFirst failed, checking in-memory user store:', err.message);
      for (const u of inMemoryUsers.values()) {
        if (u.email.toLowerCase() === normalized || u.username.toLowerCase() === normalized) {
          user = u;
          break;
        }
      }
    }

    if (!user) {
      throw new Error('Invalid email/username or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email/username or password');
    }

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return {
      user: formatUserDto(user),
      accessToken,
      refreshToken
    };
  }

  async getUserById(userId: string): Promise<UserDto | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      if (user) return formatUserDto(user);
    } catch (err: any) {
      logger.warn('Prisma getUserById fallback:', err.message);
    }

    const memoryUser = inMemoryUsers.get(userId);
    if (memoryUser) return formatUserDto(memoryUser);

    return null;
  }
}

export const authService = new AuthService();
