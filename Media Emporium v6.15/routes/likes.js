const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /likes/toggle — like or unlike post
router.post("/toggle", async (req, res) => {
  const { post_id } = req.body;
  const userGoogleId = req.user?.google_id;

  if (!post_id || !userGoogleId) {
    return res.status(400).json({ error: "Missing post_id or not authenticated" });
  }

  try {
    const likeRes = await pool.query(
      `SELECT * FROM likes WHERE post_id = $1 AND google_id = $2`,
      [post_id, userGoogleId]
    );

    if (likeRes.rows.length > 0) {
      // Unlike
      await pool.query(
        `DELETE FROM likes WHERE post_id = $1 AND google_id = $2`,
        [post_id, userGoogleId]
      );
      return res.json({ liked: false });
    } else {
      // Like
      await pool.query(
        `INSERT INTO likes (post_id, google_id) VALUES ($1, $2)`,
        [post_id, userGoogleId]
      );
      return res.json({ liked: true });
    }
  } catch (err) {
    console.error("LIKE toggle error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;