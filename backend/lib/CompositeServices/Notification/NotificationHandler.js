const FriendHandler = require("./Relations/FriendHandler");
const UserService = require('../../User/index');
const NotificationService = require('../../Notification/index');

let removeFuncMap = new Map();
removeFuncMap.set('NewFollower', FriendHandler.removeNotification)

class NotificationHandler{
    static async removeRelationNotifById(userID, notifID){
        const user = await UserService.findById(userID);
        const relNotifs = await NotificationService.findByIdAndPopulateList(user.notifications.relations.notifBucket);
        const notif = relNotifs.list.pull({to: notifID})

        let removeFunc = removeFuncMap.get(notif[0].onModel);
        await removeFunc(userID, notifID);
    }
}

module.exports = NotificationHandler;