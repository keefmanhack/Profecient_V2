import PostBucketNotification from '../Resources/PostBucketNotification/PostBucketNotif';
import NewFollowerNotification from '../Resources/NewFollowerNotification/NewFollowerNotif';

let formatMap = new Map();

formatMap.set('PostBucket', PostBucketNotification)
formatMap.set('NewFollower', NewFollowerNotification)

export default formatMap;