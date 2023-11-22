// Import the Winston library
import * as winston from "winston";

// Winston logger configuration
const logger = winston.createLogger({
  level: "info", // Set the logging level to 'info'
  format: winston.format.json(), // Use the JSON format for log entries
  defaultMeta: { service: "my-service" }, // Set default metadata for log entries
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: "error.log", level: "error" }), // Log errors to 'error.log'
    new winston.transports.File({ filename: "combined.log" }), // Log all levels to 'combined.log'
  ],
});

export default logger;
