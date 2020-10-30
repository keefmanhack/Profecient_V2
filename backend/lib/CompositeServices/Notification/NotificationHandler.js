const FriendHandler = require("./Relations/FriendHandler");
const UserService = require('../../User/index');
const NotificationService = require('../../Notification/index');
const PostHandler = require("./Relations/PostHandler");

let removeFuncMap = new Map();
removeFuncMap.set('NewFollower', FriendHandler.removeNotification)
removeFuncMap.set('PostBucket', PostHandler.removeNotification)

class NotificationHandler{
    static async removeRelationNotifById(userID, notifID){
        const relationNotifBucketID = await UserService.getRelationNotifBucketID(userID);
        const notif = await NotificationService.findItemByToID(relationNotifBucketID, notifID);

        let removeFunc = removeFuncMap.get(notif.onModel);
        await removeFunc(userID, notifID);
    }
}

module.exports = NotificationHandler;