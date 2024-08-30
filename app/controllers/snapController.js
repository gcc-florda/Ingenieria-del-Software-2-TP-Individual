const snapService = require("../services/snapService");

module.exports = (logger) => {
  const createSnap = (req, res) => {
    const { message } = req.body;

    if (!message || typeof message != "string") {
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

    try {
      const newSnapMsg = snapService.createSnap(message);
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
  };

  const getAllSnaps = (req, res) => {
    try {
      const snaps = snapService.getAllSnaps();
      logger.info("Retrieved all snaps");
      res.status(200).json({
        title: "A list of snaps",
        data: snaps,
      });
    } catch (error) {
      logger.error("Error retrieving snaps", { message: error.message });
      res.status(500).json({
        title: "Internal server error",
        detail: error.message,
      });
    }
  };

  return { createSnap, getAllSnaps };
};
