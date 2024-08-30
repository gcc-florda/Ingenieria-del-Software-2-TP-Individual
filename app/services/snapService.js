const { v4: uuidv4 } = require("uuid");

const snapMsgs = [];

const createSnap = (message) => {
  try {
    const newSnapMsg = {
      id: uuidv4(),
      message,
      createdAt: new Date(),
    };
    snapMsgs.push(newSnapMsg);
    return newSnapMsg;
  } catch (error) {
    throw error;
  }
};

const getAllSnaps = () => {
  try {
    return snapMsgs.reverse();
  } catch (error) {
    throw error;
  }
};

module.exports = { createSnap, getAllSnaps };
