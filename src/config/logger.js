import winston from "winston";
import config from "./config.js";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }

  return info;
});

const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: winston.format.combine(
    // winston.format.timestamp(),
    // enumerateErrorFormat(),
    // winston.format.printf(({timestamp, level, message}) => {
    //     return `${timestamp} [${level}] ${message}`;
    // })
    winston.format.timestamp(),
    enumerateErrorFormat(),
    config.env === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ::: [${level}] ::: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

export default logger;
