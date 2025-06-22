// routes/profile.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFileToGCS } = require('../GCS'); // your custom function
const pool = require('../db'); // your pg pool

const upload = multer({ storage: multer.memoryStorage() });

router.post('/edit', upload.single('profilePic'), async (req, res) => {
  const userId = req.user?.id; // assuming passport sets req.user
  const { username, bio } = req.body;

  try {
    let profilePicUrl;

    if (req.file) {
      // Create a unique filename for the uploaded file
      const filename = `profile-${userId}-${Date.now()}-${req.file.originalname}`;

      // Call uploadFileToGCS with correct params
      profilePicUrl = await uploadFileToGCS(
        'profile',          // bucket key string matching your GCS.js buckets object
        filename,           // filename for the upload
        req.file.buffer,    // file buffer from multer
        req.file.mimetype   // mimetype
      );
    }

    const updateQuery = `
      UPDATE users SET 
        display_name = COALESCE($1, display_name), 
        bio = COALESCE($2, bio), 
        profile_pic = COALESCE($3, profile_pic)
      WHERE id = $4
    `;

    await pool.query(updateQuery, [
      username || null,
      bio || null,
      profilePicUrl || null,
      userId
    ]);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Profile update failed:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }

  console.log("REQ FILE:", req.file); // Check if file is received
  console.log("REQ BODY:", req.body); // Check userId or other fields
});

module.exports = router;
