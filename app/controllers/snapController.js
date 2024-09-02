const snapService = require("../services/snapService");

module.exports = (logger) => {
  const createSnap = (req, res) => {
    const { message } = req.body;

    if (!message || typeof message != "string" || message.length > 280) {
      logger.warn("Bad request: invalid message parameter");
      return res.status(400).json({
        type: "about:blank",
        description: "Your request parameters didn't validate.",
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
        description: "Snap created successfully",
        content: newSnapMsg,
      });
    } catch (error) {
      logger.error("Error creating snap", { message: error.message });
      res.status(500).json({
        description: "Internal server error",
        content: error.message,
      });
    }
  };

  const getAllSnaps = (req, res) => {
    try {
      const snaps = snapService.getAllSnaps();
      logger.info("Retrieved all snaps");
      res.status(200).json({
        description: "A list of snaps",
        content: snaps,
      });
    } catch (error) {
      logger.error("Error retrieving snaps", { message: error.message });
      res.status(500).json({
        description: "Internal server error",
        content: error.message,
      });
    }
  };

  return { createSnap, getAllSnaps };
};
