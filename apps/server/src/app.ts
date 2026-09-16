import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import { authRoutes } from './modules/auth/auth.routes';
import { roomsRoutes } from './modules/rooms/rooms.routes';
import { usersRoutes } from './modules/users/users.routes';
import { contactRoutes } from './modules/contact/contact.routes';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  // Strip framework fingerprints (X-Powered-By)
  app.disable('x-powered-by');

  // Security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  }));

  // CORS configuration
  app.use(cors({
    origin: (origin, callback) => {
      // Allow localhost and specified client URL
      if (!origin || origin.includes('localhost') || origin === ENV.CLIENT_URL) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for watch party embedding
      }
    },
    credentials: true
  }));

  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'zync-server', time: new Date().toISOString() });
  });

  // API Modules
  app.use('/api/auth', authRoutes);
  app.use('/api/rooms', roomsRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/contact', contactRoutes);

  // 404 fallback for API
  app.use('/api/*', (_req, res) => {
    res.status(404).json({ success: false, error: 'API route not found' });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}
