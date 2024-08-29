const db = require("../database");
const { v4: uuidv4 } = require("uuid");

const createSnap = async (message) => {
  const id = uuidv4();
  const createdAt = new Date();

  try {
    await db.insertSnapMsg(id, message, createdAt);
    return { id, message, createdAt };
  } catch (error) {
    throw error;
  }
};

const getAllSnaps = async () => {
  try {
    const result = await db.selectAllSnaps();
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = { createSnap, getAllSnaps };
