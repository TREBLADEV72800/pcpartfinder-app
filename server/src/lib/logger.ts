export type LogLevel = "info" | "warn" | "error" | "debug";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = (process.env.LOG_LEVEL || "info") as LogLevel;

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

export const logger = {
  debug(message: string, meta?: unknown) {
    if (shouldLog("debug")) {
      console.log(`[DEBUG] ${message}`, meta ?? "");
    }
  },

  info(message: string, meta?: unknown) {
    if (shouldLog("info")) {
      console.info(`[INFO] ${message}`, meta ?? "");
    }
  },

  warn(message: string, meta?: unknown) {
    if (shouldLog("warn")) {
      console.warn(`[WARN] ${message}`, meta ?? "");
    }
  },

  error(message: string, error?: unknown) {
    if (shouldLog("error")) {
      console.error(`[ERROR] ${message}`, error ?? "");
    }
  },
};
