const express = require("express");
const dotenv = require("dotenv");
const winston = require("winston");
const controller = require("./controllers/snapController");
const database = require("./database");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

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
app.post("/snaps", snapController.createSnap);
app.get("/snaps", snapController.getAllSnaps);

database.initialize().then(() => {
  const server = app.listen(port, () => {
    logger.info(`App listening on port ${port}`);
  });

  process.on("SIGTERM", async () => {
    logger.info("SIGTERM signal received.");
    server.close();
  });

  process.on("SIGINT", async () => {
    logger.info("SIGINT signal received.");
    server.close();
  });
});
