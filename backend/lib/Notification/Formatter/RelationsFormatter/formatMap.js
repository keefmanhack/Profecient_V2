const newFollowerFunc = require('./Format Functions/NewFollower');
const PostBucketFunc = require('./Format Functions/PostBucket');

let myMap = new Map();

myMap.set('NewFollower', newFollowerFunc);
myMap.set('PostBucket', PostBucketFunc);


module.exports = myMap;

