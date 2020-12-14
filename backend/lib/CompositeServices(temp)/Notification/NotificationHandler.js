const FriendHandler = require("../../Relation Handlers/FriendHandler");
const UserService = require('../../User/index');
const NotificationService = require('../../Notification/index');
const PostHandler = require("../../Relation Handlers/PostHandler");
const AcademicHandler = require("../../Assignment/Assignment Handler/AssignmentHandler");

let removeFuncMap = new Map();
removeFuncMap.set('NewFollower', FriendHandler.removeNotification);
removeFuncMap.set('PostBucket', PostHandler.removeNotification);
removeFuncMap.set('NewAssignment', AcademicHandler.removeNotification)

class NotificationHandler{
    static async removeRelationNotifById(userID, notifID){
        const relationNotifBucketID = await UserService.getNotifBucketID(userID, UserService.notifCategories.relation);
        const notif = await NotificationService.findItemByToID(relationNotifBucketID, notifID);

        let removeFunc = removeFuncMap.get(notif.onModel);
        await removeFunc(userID, notifID);
    }

    static async removeAcademicNotifByID(userID, notifID){
        const acNotifBucketID = await UserService.getNotifBucketID(userID, UserService.notifCategories.academic);
        const notif = await NotificationService.findItemByToID(acNotifBucketID, notifID);
        let removeFunc = removeFuncMap.get(notif.onModel);

        await removeFunc(userID, notifID);
    }
}

module.exports = NotificationHandler;