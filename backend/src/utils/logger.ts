type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`\x1b[32m[INFO] [${new Date().toISOString()}]\x1b[0m ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`\x1b[33m[WARN] [${new Date().toISOString()}]\x1b[0m ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`\x1b[31m[ERROR] [${new Date().toISOString()}]\x1b[0m ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`\x1b[36m[DEBUG] [${new Date().toISOString()}]\x1b[0m ${message}`, ...args);
    }
  }
};
