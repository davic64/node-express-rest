import dotenv from 'dotenv';
import path from 'path';
import winston from 'winston';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// --- Logger ---
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
};

export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple(),
      ),
    }),
  ],
});

export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

interface AppConfig {
  NODE_ENV: 'production' | 'development';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: any;
  JWT_ACCESS_EXPIRATION_MINUTES: number;
  JWT_REFRESH_EXPIRATION_DAYS: number;
}

const config: AppConfig = {
  NODE_ENV: (process.env.NODE_ENV || 'development') as 'production' | 'development',
  PORT: parseInt(process.env.PORT || '8080', 10),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1d',
  JWT_ACCESS_EXPIRATION_MINUTES: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES!) || 30,
  JWT_REFRESH_EXPIRATION_DAYS: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS!) || 10,
};

if (!config.DATABASE_URL) {
  throw new Error('❌ Error: DATABASE_URL is not defined');
}

export default config;
