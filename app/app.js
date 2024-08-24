const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.get("/ping", (req, res) => {
  res.send("ping!");
});

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

process.on("SIGTERM", async () => {
  server.close();
});

process.on("SIGINT", async () => {
  server.close();
});
