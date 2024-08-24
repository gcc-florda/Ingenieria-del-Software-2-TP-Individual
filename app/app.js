const express = require("express");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

let snapMsgs = [];

// Post a message to the SnapMsgs app
app.post("/snapmsg", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message != "string") {
    return res.status(400).json({
      error: "You must provide a valid message.",
    });
  }

  const newSnapMsg = {
    id: uuidv4(),
    message,
    createdAt: new Date(),
  };

  snapMsgs.push(newSnapMsg);
  res.status(201).json(newSnapMsg);
});

// Get all SnapMsgs
app.get("/snapmsgs", (req, res) => {
  res.json(snapMsgs.reverse());
});

app.get("/ping", (req, res) => {
  res.send("ping!");
});

// Start server
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// Signal management
process.on("SIGTERM", async () => {
  server.close();
});

process.on("SIGINT", async () => {
  server.close();
});
