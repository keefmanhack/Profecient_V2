const UserService         = require('../../../User/index'),
	  newFollowerService  = require('../../../Notification/Categories/Relations/New Follower/index'),
	  NotificationService = require('../../../Notification/index');


class FriendHandler{
	static async removeNotification(userID, notifID){
		if(!userID || !notifID){
			throw new Error("Missing data to remove a notifcation");
		}
		//find user and decrement undissmised
		const user = await UserService.decrementRelationsNotifCt(userID);
		//remove the new follower notification
		await newFollowerService.deleteById(notifID);
		//remove the notification from relation notifBucket
		await NotificationService.removeItemByToId(user.notifications.relations.notifBucket, notifID);
	}

	static async createAndAddANewFollowerNotif(userFollowingID, userToBeFollowedID){
		if(!userFollowingID || !userToBeFollowedID){
			throw new Error("No id's supplied to create a new Follower notif");
		}
		//find user and increment undissmissed
		const userBeingFollowed = await UserService.incrementRelationsNotifCt(userToBeFollowedID);
		//generate a new followerNotification
		const newFollowerNotif = await newFollowerService.create(userFollowingID);
		//insert notification
		await NotificationService.insertItem(userBeingFollowed.notifications.relations.notifBucket, newFollowerNotif);

		return newFollowerNotif;
	}
}

module.exports = FriendHandler;