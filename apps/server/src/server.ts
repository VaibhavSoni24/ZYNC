import http from 'http';
import { createApp } from './app';
import { SocketServer } from './sockets';
import { ENV } from './config/env';
import { logger } from './utils/logger';

async function bootstrap() {
  const app = createApp();
  const server = http.createServer(app);

  // Initialize Socket.IO with OOP architecture
  new SocketServer(server);

  server.listen(ENV.PORT, () => {
    logger.info(`=========================================`);
    logger.info(`  Zync Server running on port ${ENV.PORT}`);
    logger.info(`  Environment: ${ENV.NODE_ENV}`);
    logger.info(`  Client URL: ${ENV.CLIENT_URL}`);
    logger.info(`=========================================`);
  });

  const shutdown = () => {
    logger.info('Shutting down server gracefully...');
    server.close(() => {
      logger.info('HTTP & WebSocket server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((err) => {
  logger.error('Fatal error bootstrapping server:', err);
  process.exit(1);
});
