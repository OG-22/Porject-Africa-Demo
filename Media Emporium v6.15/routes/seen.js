const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { google_id, post_id } = req.body;

  if (!google_id || !post_id) {
    return res.status(400).json({ error: "Missing google_id or post_id" });
  }

  try {
    await pool.query(
      `INSERT INTO seen_posts (google_id, post_id, created_at)
       VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING`,
      [google_id, post_id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Failed to mark post as seen:", err);
    res.status(500).json({ error: "Failed to mark post as seen" });
  }
});

module.exports = router;