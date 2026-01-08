import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: !isProduction
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "SYS:standard",
        },
      }
    : undefined,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;

/*Example Log
Development
console.log
Error: Failed to fetch locations
    at getLocation (lib/api.ts:12:15)
    at AdminLocationDetails.tsx:45:7

logger.ts
[2026-01-07 11:22:45] ERROR: Failed to fetch locations
    err: {
      "type": "Error",
      "message": "Failed to fetch locations",
      "stack": "at getLocation (lib/api.ts:12:15)..."
    }

Production
console.log
Error: Failed to fetch locations

logger.ts
{"level":"ERROR","time":"2026-01-07T04:22:45.123Z","msg":"Failed to fetch locations","err":{"message":"Internal Server Error","stack":"..."}}

*/
