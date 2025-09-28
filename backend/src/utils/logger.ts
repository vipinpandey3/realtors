import winston from "winston";
import config from "@config/index";

export interface LoggerOptions {
  service?: string;
  module?: string;
  userId?: string | number;
  requestId?: string;
}

class CustomLogger {
  private winston: winston.Logger;
  private defaultMeta: Record<string, any>;

  constructor(options: LoggerOptions = {}) {
    this.defaultMeta = {
      service: options.service || "creators-api",
      module: options.module || "app",
      environment: config.ENVIRONMENT,
      timestamp: new Date().toISOString(),
    };

    this.winston = winston.createLogger({
      level: config.logLevel,
      format: this.getLogFormat(),
      defaultMeta: this.defaultMeta,
      transports: this.getTransports(),
      exitOnError: false,
    });

    this.winston.exceptions.handle(
      new winston.transports.File({
        filename: "logs/exceptions.log",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      })
    );

    this.winston.rejections.handle(
      new winston.transports.File({
        filename: "logs/rejections.log",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      })
    );
  }

  private getLogFormat(): winston.Logform.Format {
    const { combine, timestamp, colorize, printf, json, errors, metadata } =
      winston.format;

    const consoleFormat = combine(
      colorize({ all: true }),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
      printf((info) => {
        let log = `${info.timestamp} [${info.level}]: ${info.message}`;

        if (info.metadata && Object.keys(info.metadata).length > 0) {
          log += ` ${JSON.stringify(info.metadata)}`;
        }

        if (info.stack) {
          log += `\n${info.stack}`;
        }

        return log;
      })
    );

    const jsonFormat = combine(
      timestamp(),
      errors({ stack: true }),
      metadata(),
      json()
    );

    return config.ENVIRONMENT === "production" ? jsonFormat : consoleFormat;
  }

  private getTransports(): winston.transport[] {
    const transports: winston.transport[] = [];

    transports.push(
      new winston.transports.Console({
        level: config.ENVIRONMENT === "production" ? "warn" : "debug",
        handleExceptions: false,
        handleRejections: false,
      })
    );

    if (config.ENVIRONMENT === "production") {
      transports.push(
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
          maxsize: 10 * 1024 * 1024,
          maxFiles: 5,
          tailable: true,
        })
      );

      transports.push(
        new winston.transports.File({
          filename: "logs/combined.log",
          maxsize: 10 * 1024 * 1024,
          maxFiles: 10,
          tailable: true,
        })
      );
    } else {
      transports.push(
        new winston.transports.File({
          filename: "logs/development.log",
          maxsize: 5 * 1024 * 1024,
          maxFiles: 3,
          tailable: true,
        })
      );
    }

    return transports;
  }

  public error(message: string, meta?: any): void {
    this.winston.error(message, meta);
  }

  public warn(message: string, meta?: any): void {
    this.winston.warn(message, meta);
  }

  public info(message: string, meta?: any): void {
    this.winston.info(message, meta);
  }

  public debug(message: string, meta?: any): void {
    this.winston.debug(message, meta);
  }

  public verbose(message: string, meta?: any): void {
    this.winston.verbose(message, meta);
  }

  public logRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    meta?: any
  ): void {
    const logData = {
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
      ...meta,
    };

    if (statusCode >= 400) {
      this.error(`${method} ${url} - ${statusCode}`, logData);
    } else {
      this.info(`${method} ${url} - ${statusCode}`, logData);
    }
  }

  public logDatabase(
    operation: string,
    table: string,
    duration?: number,
    meta?: any
  ): void {
    const logData = {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
      ...meta,
    };

    this.debug(`Database ${operation} on ${table}`, logData);
  }

  public logAuth(action: string, userId?: string | number, meta?: any): void {
    const logData = {
      action,
      userId,
      ...meta,
    };

    this.info(`Auth: ${action}`, logData);
  }

  public logError(error: Error, context?: string, meta?: any): void {
    const logData = {
      context,
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
      ...meta,
    };

    this.error(`Error in ${context || "application"}`, logData);
  }

  public child(additionalMeta: Record<string, any>): CustomLogger {
    const childOptions: LoggerOptions = {
      ...this.defaultMeta,
      ...additionalMeta,
    };

    return new CustomLogger(childOptions);
  }

  public getWinstonInstance(): winston.Logger {
    return this.winston;
  }

  public async close(): Promise<void> {
    this.winston.close();
  }
}

export const logger = new CustomLogger();

export { CustomLogger };
export default logger;
