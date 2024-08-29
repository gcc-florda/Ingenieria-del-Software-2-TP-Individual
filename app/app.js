const express = require("express");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const winston = require("winston");
const { Pool } = require("pg");

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

const pool = new Pool({
  host: "postgres",
  user: "root",
  port: 5432,
  password: "1234",
  database: "snapdb",
});

async function initializeDatabase() {
  const client = await pool.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS snap_msgs (
      id UUID PRIMARY KEY,
      message TEXT NOT NULL,
      createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  client.release();
}

app.post("/snaps", async (req, res) => {
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
    const client = await pool.connect();
    await client.query(
      "INSERT INTO snap_msgs (id, message, createdAt) VALUES ($1, $2, $3)",
      [newSnapMsg.id, newSnapMsg.message, newSnapMsg.createdAt]
    );
    client.release();

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

app.get("/snaps", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM snap_msgs ORDER BY createdAt DESC"
    );
    client.release();

    logger.info("Retrieved all snaps");
    res.status(200).json({
      title: "A list of snaps",
      data: result.rows,
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

initializeDatabase().then(() => {
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
});
