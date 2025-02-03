import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/config.js";
import logger from "./config/logger.js";
import { seedRoles } from "./seed/role.seeder.js";

let server;
mongoose
  .connect(config.mongoose.url)
  .then(async () => {
    logger.info("Connected to MongoDB");
    await seedRoles();
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch((err) => logger.error(err));

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server Closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => {
  logger.info("SIGTERM received", () => {
    if (server) {
      server.close();
    }
  });
});
