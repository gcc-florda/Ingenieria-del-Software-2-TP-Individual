const MAX_MESSAGE_CHARACTERS = 280;

const validateSnapInput = (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      type: "about:blank",
      title: "Your request parameters didn't validate.",
      status: 400,
      detail: "message is required and must be a string",
      instance: "/snaps",
    });
  }

  if (typeof message !== "string") {
    return res.status(400).json({
      type: "about:blank",
      title: "Your request parameters didn't validate.",
      status: 400,
      detail: "message must be a string",
      instance: "/snaps",
    });
  }

  if (message.length > MAX_MESSAGE_CHARACTERS) {
    return res.status(400).json({
      type: "about:blank",
      title: "Your request parameters didn't validate.",
      status: 400,
      detail: `'message must not exceed ${MAX_MESSAGE_CHARACTERS} characters'`,
      instance: "/snaps",
    });
  }

  next();
};

module.exports = {
  validateSnapInput,
};
