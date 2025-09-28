import app from "./app";
import config from "@config/index";
import models from "@models/index";
import logger from "@utils/logger";

const startServer = async (): Promise<void> => {
  try {
    const dbStartTime = Date.now();
    await models.sequelize.authenticate();
    const dbConnectTime = Date.now() - dbStartTime;

    logger.info("Database connected successfully", {
      connectionTime: `${dbConnectTime}ms`,
      host: config.db.host,
      port: config.db.port,
      database: config.db.name,
    });

    app.listen(config.SERVER_PORT, () => {
      logger.info("Server started successfully", {
        port: config.SERVER_PORT,
        environment: config.ENVIRONMENT,
        healthCheck: `http://localhost:${config.port}/api/health`,
        logLevel: config.logLevel,
      });
    });
  } catch (error) {
    logger.logError(
      error instanceof Error ? error : new Error(String(error)),
      "Server startup",
      { port: config.SERVER_PORT, environment: config.ENVIRONMENT }
    );
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`Received ${signal} signal. Starting graceful shutdown...`);

  try {
    await models.sequelize.close();
    logger.info("Database connection closed successfully");
    await logger.close();

    process.exit(0);
  } catch (error) {
    logger.logError(
      error instanceof Error ? error : new Error(String(error)),
      "Graceful shutdown",
      { signal }
    );
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

startServer();
