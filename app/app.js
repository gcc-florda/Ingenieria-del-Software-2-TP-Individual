const express = require("express");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const winston = require("winston");

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

const snapMsgs = [];

app.post("/snaps", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    logger.warn("Bad request: invalid message parameter");
    return res.status(400).json({
      type: "about:blank",
      title: "Your request parameters didn't validate.",
      "invalid-params": [
        {
          name: "message",
          reason: "message is required and must be a string",
        },
      ],
    });
  }

  const newSnapMsg = {
    id: uuidv4(),
    message,
    createdAt: new Date(),
  };

  try {
    snapMsgs.push(newSnapMsg);

    logger.info("Snap created successfully", { id: newSnapMsg.id });
    res.status(201).json({
      title: "Snap created successfully",
      data: newSnapMsg,
    });
  } catch (error) {
    logger.error("Error creating snap", { message: error.message });
    res.status(500).json({
      title: "Internal server error",
      detail: error.message,
    });
  }
});

app.get("/snaps", (req, res) => {
  try {
    logger.info("Retrieved all snaps");
    res.status(200).json({
      title: "A list of snaps",
      data: snapMsgs.reverse(),
    });
  } catch (error) {
    logger.error("Error retrieving snaps", { message: error.message });
    res.status(500).json({
      title: "Internal server error",
      detail: error.message,
    });
  }
});

app.get("/ping", (req, res) => {
  logger.info("Ping request received");
  res.send("ping!");
});

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
