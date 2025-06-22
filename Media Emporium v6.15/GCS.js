const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  keyFilename: path.join(__dirname, 'service-account.json'),
  projectId: 'media-emporium-462711',
});

const buckets = {
  profile: storage.bucket('22_profile_pictures'),
  image: storage.bucket('22_post-images-bucket'),
  video: storage.bucket('22_post-videos-bucket'),
};

module.exports = buckets;
