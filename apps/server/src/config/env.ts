import dotenv from 'dotenv';
import path from 'path';

// Load .env from server directory or root if available
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/zync?schema=public',
  REDIS_URL: process.env.REDIS_URL || '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'zync-access-super-secret-key-2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'zync-refresh-super-secret-key-2026',
  BREVO_API_KEY: process.env.BREVO_API_KEY || '',
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL || 'vaibhav@zync.live',
  BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || 'Zync Team',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  CONTACT_RECEIVER_EMAIL: process.env.CONTACT_RECEIVER_EMAIL || 'vaibhavsoni280506@gmail.com'
};
