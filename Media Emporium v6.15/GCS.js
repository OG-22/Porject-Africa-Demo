const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

const buckets = {
  profile: storage.bucket('22_profile_pictures'),
  image: storage.bucket('22_post-images-bucket'),
  video: storage.bucket('22_post-videos-bucket'),
};

module.exports = buckets;
