const express = require("express");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

let snapMsgs = [];

app.post("/snaps", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message != "string") {
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

  snapMsgs.push(newSnapMsg);
  res.status(201).json({
    title: "Snap created successfully",
    data: newSnapMsg,
  });
});

app.get("/snaps", (req, res) => {
  try {
    res.status(200).json({
      title: "A list of snaps",
      data: snapMsgs.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      title: "Internal server error",
      detail: error.message,
    });
  }
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
