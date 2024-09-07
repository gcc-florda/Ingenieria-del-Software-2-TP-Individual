const snapService = require("../services/snapService");

module.exports = (logger) => {
  const createSnap = (req, res) => {
    const { message } = req.body;

    try {
      const newSnapMsg = snapService.createSnap(message);
      logger.info("Snap created successfully", { id: newSnapMsg.id });
      res.status(201).json({
        data: newSnapMsg,
      });
    } catch (error) {
      logger.error("Error creating snap", { message: error.message });
      res.status(500).json({
        type: "about:blank",
        title: "Internal server error",
        status: 500,
        detail: "error creating snap",
        instance: "/snaps",
      });
    }
  };

  const getAllSnaps = (req, res) => {
    try {
      const snaps = snapService.getAllSnaps();
      logger.info("Retrieve all snaps");
      res.status(200).json({
        data: snaps,
      });
    } catch (error) {
      logger.error("Error retrieving snaps", { message: error.message });
      res.status(500).json({
        type: "about:blank",
        title: "Internal server error",
        status: 500,
        detail: "error retrieving snaps",
        instance: "/snaps",
      });
    }
  };

  return { createSnap, getAllSnaps };
};
