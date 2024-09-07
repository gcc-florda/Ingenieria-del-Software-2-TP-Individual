const express = require("express");
const dotenv = require("dotenv");
const winston = require("winston");
const controller = require("./controllers/snapController");
const database = require("./database");
const { validateSnapInput } = require("./middleware/snapMiddleware");

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
app.post("/snaps", validateSnapInput, snapController.createSnap);
app.get("/snaps", snapController.getAllSnaps);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status == 400 && "body" in err) {
    logger.warn("Bad request: invalid message parameter");
    return res.status(400).json({
      type: "about:blank",
      title: "Your request parameters didn't validate.",
      status: 400,
      detail: "invalid json format",
      instance: "/snaps",
    });
  }
});

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
