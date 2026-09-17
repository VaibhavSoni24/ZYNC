import crypto from 'crypto';
import { redisClient } from '../config/redis';
import { logger } from './logger';

const OTP_TTL_SECONDS = 600; // 10 minutes
const COOLDOWN_SECONDS = 60; // 60 seconds
const MAX_ATTEMPTS = 5;

export interface PendingRegistrationData {
  name: string;
  username: string;
  email: string;
  dob: string;
  passwordHash: string;
  avatar: string;
  bio?: string;
}

export function generateNumericOtp(length = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }
  return otp;
}

export async function storeOtp(email: string, otp: string, userData?: PendingRegistrationData): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  const otpKey = `otp:${normalizedEmail}`;
  const cooldownKey = `otp_cooldown:${normalizedEmail}`;
  const attemptsKey = `otp_attempts:${normalizedEmail}`;
  const pendingKey = `otp_pending:${normalizedEmail}`;

  await redisClient.set(otpKey, otp, 'EX', OTP_TTL_SECONDS);
  await redisClient.set(cooldownKey, '1', 'EX', COOLDOWN_SECONDS);
  await redisClient.set(attemptsKey, '0', 'EX', OTP_TTL_SECONDS);

  if (userData) {
    await redisClient.set(pendingKey, JSON.stringify(userData), 'EX', OTP_TTL_SECONDS);
  }

  logger.info(`OTP stored for ${normalizedEmail} (TTL: ${OTP_TTL_SECONDS}s)`);
}

export async function isOtpInCooldown(email: string): Promise<{ inCooldown: boolean; remainingSeconds: number }> {
  const normalizedEmail = email.toLowerCase().trim();
  const cooldownKey = `otp_cooldown:${normalizedEmail}`;
  const ttl = await redisClient.ttl(cooldownKey);
  if (ttl > 0) {
    return { inCooldown: true, remainingSeconds: ttl };
  }
  return { inCooldown: false, remainingSeconds: 0 };
}

export async function verifyOtp(email: string, submittedOtp: string): Promise<{
  success: boolean;
  message?: string;
  userData?: PendingRegistrationData;
}> {
  const normalizedEmail = email.toLowerCase().trim();
  const otpKey = `otp:${normalizedEmail}`;
  const attemptsKey = `otp_attempts:${normalizedEmail}`;
  const pendingKey = `otp_pending:${normalizedEmail}`;

  const storedOtp = await redisClient.get(otpKey);
  if (!storedOtp) {
    return { success: false, message: 'Verification code has expired or was not requested. Please request a new code.' };
  }

  const attemptsStr = await redisClient.get(attemptsKey);
  const currentAttempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;

  if (currentAttempts >= MAX_ATTEMPTS) {
    // Invalidate the OTP because max attempts exceeded
    await redisClient.del(otpKey);
    await redisClient.del(pendingKey);
    return { success: false, message: 'Too many incorrect attempts. For security, please request a fresh code.' };
  }

  if (storedOtp !== submittedOtp.trim()) {
    await redisClient.incr(attemptsKey);
    const remaining = MAX_ATTEMPTS - (currentAttempts + 1);
    return {
      success: false,
      message: `Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
    };
  }

  // OTP is correct! Fetch pending registration data
  let userData: PendingRegistrationData | undefined;
  const pendingRaw = await redisClient.get(pendingKey);
  if (pendingRaw) {
    try {
      userData = JSON.parse(pendingRaw);
    } catch {
      // ignore
    }
  }

  // Cleanup OTP from Redis
  await redisClient.del(otpKey);
  await redisClient.del(attemptsKey);
  await redisClient.del(pendingKey);

  return { success: true, userData };
}

export async function storeActionOtp(
  purpose: 'reset' | 'delete',
  email: string,
  otp: string,
  metadata?: any
): Promise<void> {
  const normalizedEmail = email.toLowerCase().trim();
  const otpKey = `otp:${purpose}:${normalizedEmail}`;
  const cooldownKey = `otp_cooldown:${purpose}:${normalizedEmail}`;
  const attemptsKey = `otp_attempts:${purpose}:${normalizedEmail}`;
  const metaKey = `otp_meta:${purpose}:${normalizedEmail}`;

  await redisClient.set(otpKey, otp, 'EX', OTP_TTL_SECONDS);
  await redisClient.set(cooldownKey, '1', 'EX', COOLDOWN_SECONDS);
  await redisClient.set(attemptsKey, '0', 'EX', OTP_TTL_SECONDS);

  if (metadata) {
    await redisClient.set(metaKey, JSON.stringify(metadata), 'EX', OTP_TTL_SECONDS);
  }

  logger.info(`Action OTP (${purpose}) stored for ${normalizedEmail} (TTL: ${OTP_TTL_SECONDS}s)`);
}

export async function isActionOtpInCooldown(
  purpose: 'reset' | 'delete',
  email: string
): Promise<{ inCooldown: boolean; remainingSeconds: number }> {
  const normalizedEmail = email.toLowerCase().trim();
  const cooldownKey = `otp_cooldown:${purpose}:${normalizedEmail}`;
  const ttl = await redisClient.ttl(cooldownKey);
  if (ttl > 0) {
    return { inCooldown: true, remainingSeconds: ttl };
  }
  return { inCooldown: false, remainingSeconds: 0 };
}

export async function verifyActionOtp(
  purpose: 'reset' | 'delete',
  email: string,
  submittedOtp: string
): Promise<{ success: boolean; message?: string; metadata?: any }> {
  const normalizedEmail = email.toLowerCase().trim();
  const otpKey = `otp:${purpose}:${normalizedEmail}`;
  const attemptsKey = `otp_attempts:${purpose}:${normalizedEmail}`;
  const metaKey = `otp_meta:${purpose}:${normalizedEmail}`;

  const storedOtp = await redisClient.get(otpKey);
  if (!storedOtp) {
    return {
      success: false,
      message: 'Verification code has expired or was not requested. Please request a new code.'
    };
  }

  const attemptsStr = await redisClient.get(attemptsKey);
  const currentAttempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;

  if (currentAttempts >= MAX_ATTEMPTS) {
    await redisClient.del(otpKey);
    await redisClient.del(metaKey);
    return {
      success: false,
      message: 'Too many incorrect attempts. For security, please request a fresh code.'
    };
  }

  if (storedOtp !== submittedOtp.trim()) {
    await redisClient.incr(attemptsKey);
    const remaining = MAX_ATTEMPTS - (currentAttempts + 1);
    return {
      success: false,
      message: `Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
    };
  }

  let metadata: any;
  const metaRaw = await redisClient.get(metaKey);
  if (metaRaw) {
    try {
      metadata = JSON.parse(metaRaw);
    } catch {
      // ignore
    }
  }

  // Cleanup
  await redisClient.del(otpKey);
  await redisClient.del(attemptsKey);
  await redisClient.del(metaKey);

  return { success: true, metadata };
}

