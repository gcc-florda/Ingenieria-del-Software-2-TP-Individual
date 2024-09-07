const express = require("express");
const dotenv = require("dotenv");
const winston = require("winston");
const controller = require("./controllers/snapController");
const { validateSnapInput } = require("./middleware/snapMiddleware");

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

app.use(express.json());

const snapController = controller(logger);
app.post("/snaps", validateSnapInput, snapController.createSnap);
app.get("/snaps", snapController.getAllSnaps);

// Start server
const server = app.listen(port, () => {
  logger.info(`App listening on port ${port}`);
});

// Signal management
process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received.");
  server.close();
});

process.on("SIGINT", async () => {
  logger.info("SIGINT signal received.");
  server.close();
});

module.exports = app;
