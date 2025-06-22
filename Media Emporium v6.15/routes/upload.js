const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const buckets = require('../GCS');
const pool = require('../db');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Middleware to make sure user is authenticated
function isLoggedIn(req, res, next) {
  if (req.user) return next();
  console.log('⛔ Not logged in - Unauthorized');
  return res.status(401).json({ message: 'Unauthorized: User not logged in' });
}

// ✅ Upload route for profile picture
router.post('/upload', isLoggedIn, upload.single('profilePic'), async (req, res) => {
  try {
    console.log('📥 Incoming upload request');

    const file = req.file;
    const userId = req.user?.id;
    const { username, bio } = req.body;

    console.log('🧾 Request body:', req.body);
    console.log('🧑‍💻 Authenticated user ID:', userId);
    console.log('📎 File received:', file?.originalname || 'None');

    let publicUrl = null;
    if (file) {
      const ext = path.extname(file.originalname);
      const fileName = `profile-${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
      const blob = buckets.profile.file(fileName);

      await new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream({
          resumable: false,
          contentType: file.mimetype,
          metadata: {
            cacheControl: 'public, max-age=31536000',
          },
        });

        blobStream.on('error', (err) => {
          console.error('🔥 Google Cloud upload error:', err);
          reject(err);
        });

        blobStream.on('finish', () => {
          publicUrl = `https://storage.googleapis.com/${buckets.profile.name}/${fileName}`;
          console.log('✅ Upload complete:', publicUrl);
          resolve();
        });

        blobStream.end(file.buffer);
      });
    }

    // Build the dynamic update query
    const fields = [];
    const values = [];
    let index = 1;

    if (publicUrl) {
      fields.push(`profile_pic = $${index++}`);
      values.push(publicUrl);
    }

    if (username !== undefined && username !== '') {
      fields.push(`display_name = $${index++}`);
      values.push(username);
    }

    if (bio !== undefined && bio !== '') {
      fields.push(`bio = $${index++}`);
      values.push(bio);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No data provided to update' });
    }

    values.push(userId); // for WHERE clause
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${index}`;
    const result = await pool.query(query, values);

    console.log('📦 DB update result:', result.rowCount);
    res.status(200).json({ message: 'Profile updated successfully', imageUrl: publicUrl || null });

  } catch (err) {
    console.error('💥 Server error:', err);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// DELETE /posts/delete/:id
router.delete("/delete/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    // Optional: Check that the user owns the post before deleting
    await pool.query("DELETE FROM posts WHERE id = $1", [postId]);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
