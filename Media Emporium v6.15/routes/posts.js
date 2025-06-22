const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const buckets = require("../GCS");
const pool = require("../db");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

function getExtension(filename) {
  return path.extname(filename).toLowerCase();
}

// Route: /posts/upload
router.post("/upload", upload.array("media"), async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const files = req.files;
  const caption = req.body.caption || "";
  const google_id = req.user.google_id;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: "No files uploaded." });
  }

  try {
    const uploadPromises = files.map(async (file) => {
      const ext = getExtension(file.originalname);
      const isImage = ext.startsWith(".jpg") || ext.startsWith(".jpeg") || ext.startsWith(".png") || ext.startsWith(".webp");
      const isVideo = ext.startsWith(".mp4") || ext.startsWith(".mov") || ext.startsWith(".webm");

      let bucket;
      let dbColumn;

      if (isImage) {
        bucket = buckets.image;
        dbColumn = "image_url";
      } else if (isVideo) {
        bucket = buckets.video;
        dbColumn = "video_url";
      } else {
        throw new Error("Unsupported file type: " + ext);
      }

      const filename = `${dbColumn}-${Date.now()}-${uuidv4()}${ext}`;
      const blob = bucket.file(filename);

      await blob.save(file.buffer, {
        contentType: file.mimetype,
        resumable: false,
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

      await pool.query(
        `INSERT INTO posts (${dbColumn}, caption, google_id) VALUES ($1, $2, $3)`,
        [publicUrl, caption, google_id]
      );

      return publicUrl;
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    res.status(200).json({ message: "Upload successful", files: uploadedUrls });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Server error during upload" });
  }
});

// Get posts for the logged-in user
router.get("/user-posts", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const googleId = req.user.google_id;
    const result = await pool.query(
      "SELECT * FROM posts WHERE google_id = $1 ORDER BY created_at DESC",
      [googleId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch user posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
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