const { Pool } = require("pg");

const pool = new Pool({
  host: "postgres",
  user: "root",
  port: 5432,
  password: "1234",
  database: "snapdb",
});

const initialize = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS snap_msgs (
        id UUID PRIMARY KEY,
        message TEXT NOT NULL,
        createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  } finally {
    client.release();
  }
};

const insertSnapMsg = async (id, message, createdAt) => {
  const client = await pool.connect();
  try {
    await client.query(
      "INSERT INTO snap_msgs (id, message, createdAt) VALUES ($1, $2, $3)",
      [id, message, createdAt]
    );
  } finally {
    client.release();
  }
};

const selectAllSnaps = async () => {
  const client = await pool.connect();
  try {
    return await client.query(
      "SELECT * FROM snap_msgs ORDER BY createdAt DESC"
    );
  } finally {
    client.release();
  }
};

module.exports = { initialize, insertSnapMsg, selectAllSnaps };
