// routes/reels.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/batch", async (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  const viewerGoogleId = req.query.viewerGoogleId;

  if (!viewerGoogleId) {
    return res.status(400).json({ error: "Missing viewerGoogleId" });
  }

  try {
    // 1. Seen post IDs
    const seenPostRes = await pool.query(
      `SELECT post_id FROM seen_posts WHERE google_id = $1`,
      [viewerGoogleId]
    );
    const seenPostIds = seenPostRes.rows.map(row => row.post_id);
    const safePostIds = seenPostIds.length > 0 ? seenPostIds : [-1];

    // 2. Seen poster IDs
    const seenUserRes = await pool.query(
      `SELECT DISTINCT p.google_id
       FROM seen_posts s
       JOIN posts p ON s.post_id = p.id
       WHERE s.google_id = $1`,
      [viewerGoogleId]
    );
    const seenPosterIds = seenUserRes.rows.map(row => row.google_id);
    const safePosterIds = seenPosterIds.length > 0 ? seenPosterIds : ['--none--'];

    // 3. Only video posts, not seen
    const result = await pool.query(`
      SELECT 
        posts.id AS post_id,
        posts.caption,
        posts.video_url,
        posts.google_id AS poster_google_id,
        users.display_name,
        users.profile_pic,
        COALESCE(COUNT(likes.id), 0) AS like_count,
        BOOL_OR(likes.google_id = $2) AS liked_by_viewer
      FROM posts
      JOIN users ON posts.google_id = users.google_id
      LEFT JOIN likes ON posts.id = likes.post_id
      WHERE posts.id != ALL($4)
        AND posts.video_url IS NOT NULL
        AND (
          posts.google_id != ALL($3)
          OR posts.google_id = $2
        )
      GROUP BY posts.id, users.display_name, users.profile_pic
      ORDER BY RANDOM()
      LIMIT $1;
    `, [limit, viewerGoogleId, safePosterIds, safePostIds]);

    const posts = result.rows;

    // 4. Mark seen
    const markSeen = posts.map(post =>
      pool.query(
        `INSERT INTO seen_posts (google_id, post_id, created_at)
         VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING`,
        [viewerGoogleId, post.post_id]
      )
    );
    await Promise.all(markSeen);

    res.json(posts);
  } catch (err) {
    console.error("🔴 Reels ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;