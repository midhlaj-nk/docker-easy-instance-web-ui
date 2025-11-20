/**
 * Logger utility for Easy Instance
 * Automatically filters console.log in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log messages (only in development)
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Error messages (always logged)
   */
  error: (...args) => {
    console.error(...args);
  },

  /**
   * Warning messages (only in development)
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Info messages (only in development)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Debug messages (only in development)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

export default logger;


