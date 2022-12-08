/* eslint-disable no-prototype-builtins */
import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';

const env = process.env.NODE_ENV || 'development';
const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const options = {
  console: {
    level: 'info',
    db: process.env.MONGODB_URI as string,
    options: {
      useUnifiedTopology: true,
    },
    collection: 'info_logs',
    format: format.combine(
      format.timestamp({
        format: 'DD-MM-YYYY HH:mm:ss',
      }),
      format.json(),
      format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
    ),
  },
  debug: {
    level: 'debug',
    db: process.env.MONGODB_URI as string,
    options: {
      useUnifiedTopology: true,
    },
    collection: 'debug_logs',
    format: format.combine(
      format.timestamp({
        format: 'DD-MM-YYYY HH:mm:ss',
      }),
      format.json(),
      format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
    ),
  },
  error: {
    level: 'error',
    db: process.env.MONGODB_URI as string,
    options: {
      useUnifiedTopology: true,
    },
    collection: 'error_logs',
    format: format.combine(
      format.timestamp({
        format: 'DD-MM-YYYY HH:mm:ss',
      }),
      format.json(),
      format.errors({ stack: true }),
      format.metadata({ fillExcept: ['message', 'level', 'timestamp'] })
    ),
  },
};

const logger = createLogger({
  transports: [
    new transports.File({
      filename:
        env === 'development'
          ? path.join(logDir, 'application-debug.log')
          : path.join(logDir, 'application.log'),
      level: env === 'development' ? 'debug' : 'info',
      format: format.combine(
        format.timestamp({
          format: 'DD-MM-YYYY HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
        format.printf(({ level, message, timestamp, stack, metadata }) => {
          const stackTrace = stack ? `- ${stack}` : '';

          let meta = '';

          for (const key in metadata) {
            if (metadata.hasOwnProperty(key)) {
              meta += `${key}: ${metadata[key]} | `;

              if (
                Object.keys(metadata).indexOf(key) ===
                Object.keys(metadata).length - 1
              ) {
                meta = meta.slice(0, -3);
                meta += '';
              }
            }
          }

          return `${timestamp} ${level}: ${message} ${stackTrace} || ${meta}`;
        }),
        format.prettyPrint()
      ),
    }),

    new transports.Console({
      level: env === 'development' ? 'debug' : 'info',
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'DD-MM-YYYY HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
        format.printf(({ level, message, timestamp, stack, metadata }) => {
          const stackTrace = stack ? `- ${stack}` : '';

          let meta = '';

          for (const key in metadata) {
            if (metadata.hasOwnProperty(key)) {
              meta += `${key}: ${metadata[key]} | `;

              if (
                Object.keys(metadata).indexOf(key) ===
                Object.keys(metadata).length - 1
              ) {
                meta = meta.slice(0, -3);
                meta += '';
              }
            }
          }

          return `${timestamp} ${level}: ${message} ${stackTrace} || ${meta}`;
        })
      ),
    }),

    new transports.MongoDB(options.console),
    new transports.MongoDB(options.debug),
    new transports.MongoDB(options.error),
  ],
});

export default logger;
