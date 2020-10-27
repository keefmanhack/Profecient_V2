const UserService         = require('../../../User/index'),
	  newFollowerService  = require('../../../Notification/Relations/New Follower/index'),
	  NotificationService = require('../../../Notification/index');


class FriendHandler{
	static async removeNotification(userID, notifID){
		if(!userID || !notifID){
			throw new Error("Missing data to remove a notifcation");
		}
		const user = await UserService.findById(userID);
		await newFollowerService.deleteById(notifID);
		user.notifications.relations.unDismissed--;

		const notifBucket = await NotificationService.findById(user.notifications.relations.notifs);
		notifBucket.pull(notifID);
		return await notifBucket.save();
	}

	static async createAndAddANewFollowerNotif(userFollowingID, userToBeFollowedID){
		if(!userFollowingID || !userToBeFollowedID){
			throw new Error("No id's supplied to create a new Follower notif");
		}
		const userToBeFollowed = await UserService.findById(userToBeFollowedID);
		const newNotif = await newFollowerService.create(userFollowingID);
		userToBeFollowed.notifications.relations.unDismissed++;

		const notifBucket = await NotificationService.findById(userToBeFollowed.notifications.relations.notifs);
		notifBucket.push(newNotif);
		await notifBucket.save();
		return newNotif;
	}

	static async prepareDataToSend(notifIDs){
		let returnArr = [];
		for(let i =0; i<notifIDs.length; i++){
			const notif = await newFollowerService.findById(notifIDs[i]);
			let user = await UserService.findById(notif.followerID);
			const data = {
				name: user.name,
				school: user.school,
				profilePictureURL: user.profilePictureURL,
				followerID: user._id,
				_id: notif._id,
			}
			returnArr.push(data);
		}
		return returnArr;
	}
}

module.exports = FriendHandler;