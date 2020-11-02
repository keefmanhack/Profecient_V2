import PostBucketNotification from '../Resources/PostBucketNotification/PostBucketNotif';
import NewFollowerNotification from '../Resources/NewFollowerNotification/NewFollowerNotif';
import NewAssignmentNotification from '../Resources/NewAssignmentNotification/NewAssignmentNotif';

let formatMap = new Map();

formatMap.set('PostBucket', PostBucketNotification)
formatMap.set('NewFollower', NewFollowerNotification)
formatMap.set('NewAssignment', NewAssignmentNotification)

export default formatMap;