const { v4: uuidv4 } = require("uuid");

const snapMsgs = [];

const createSnap = (message) => {
  const id = uuidv4();
  const createdAt = new Date();

  try {
    const newSnapMsg = {
      id,
      message,
      createdAt,
    };
    snapMsgs.push(newSnapMsg);
    return { id, message };
  } catch (error) {
    throw error;
  }
};

const getAllSnaps = () => {
  try {
    return snapMsgs
      .slice()
      .reverse()
      .map(({ id, message }) => ({ id, message }));
  } catch (error) {
    throw error;
  }
};

module.exports = { createSnap, getAllSnaps };
