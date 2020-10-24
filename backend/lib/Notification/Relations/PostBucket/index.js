const PostBucket = require('./postBucket-model');
const PostBucketService = require('./postBucket-service');

module.exports = PostBucketService(PostBucket);