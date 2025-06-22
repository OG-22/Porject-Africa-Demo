const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL pool

router.get('/profile', async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Not logged in' });
    }

    const googleId = req.user.google_id;

    // Run all three queries in parallel
    const [userRes, postCountRes, followerData] = await Promise.all([
      pool.query(
        'SELECT display_name AS username, bio, profile_pic FROM users WHERE google_id = $1',
        [googleId]
      ),
      pool.query(
        'SELECT COUNT(*) FROM posts WHERE google_id = $1',
        [googleId]
      ),
      pool.query(
        `SELECT
          (SELECT COUNT(*) FROM following WHERE following_id = $1) AS followers,
          (SELECT COUNT(*) FROM following WHERE follower_id = $1) AS following`,
        [googleId]
      )
    ]);

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRes.rows[0];
    const posts = postCountRes.rows[0].count;
    const followers = followerData.rows[0].followers;
    const following = followerData.rows[0].following;

    res.json({
      username: user.username,
      bio: user.bio,
      profile_pic: user.profile_pic,
      posts,
      followers,
      following
    });

  } catch (err) {
    console.error('Error in /api/user/profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in" });
  res.json({ google_id: req.user.google_id });
});

module.exports = router;
