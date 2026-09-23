import { createApp } from './app.js';
import { config } from './config/env.js';
import { checkDatabaseConnection, pool } from './config/database.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  logger.info('[Server] Initializing TerraTech Backend Service...');

  // Attempt database connection check
  await checkDatabaseConnection();

  const app = createApp();
  const server = app.listen(config.port, () => {
    logger.info(`================================================================`);
    logger.info(`🚀 TerraTech Backend running on http://localhost:${config.port}`);
    logger.info(`📚 Swagger Documentation: http://localhost:${config.port}/api/docs`);
    logger.info(`🏥 Health Check:          http://localhost:${config.port}/api/health`);
    logger.info(`🤖 ML Service Proxy:      ${config.mlServiceUrl}`);
    logger.info(`🛡️ Environment:           ${config.nodeEnv}`);
    logger.info(`================================================================`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await pool.end();
        logger.info('[Server] Database pool closed.');
      } catch (err) {
        logger.error('[Server] Error closing DB pool:', err);
      }
      logger.info('[Server] Process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch(err => {
  logger.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
