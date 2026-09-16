import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { ENV } from '../config/env';

export interface TokenPayload {
  userId: string;
  username: string;
  email: string;
}

export const REFRESH_TOKEN_COOKIE_NAME = 'zync_refresh_token';

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, {
    expiresIn: '15m'
  });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function setRefreshTokenCookie(res: Response, token: string): void {
  const isProduction = ENV.NODE_ENV === 'production';
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  const isProduction = ENV.NODE_ENV === 'production';
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });
}
