const ClassService        = require('../Class/index'),
	  ClassNoteService    = require('../Notification/Class/index'),
	  UserService         = require('../User/index'),
	  newFollowerService  = require('../Notification/Relations/New Follower/index');

class NotificationHandler{
	static async createAndAddANewFollowerNotif(userFollowingID, userToBeFollowedID){
		if(!userFollowingID || !userToBeFollowedID){
			throw new Error("No id's supplied to create a new Follower notif");
		}
		const userToBeFollowed = await UserService.findById(userToBeFollowedID);
		const newNotif = await newFollowerService.create(userFollowingID);
		userToBeFollowed.notifications.relations.unDismissed++;
		userToBeFollowed.notifications.relations.newFollowerNote.push(newNotif);
		await userToBeFollowed.save();
		return newNotif;
	}

	static async prepareDataToSend(notifIDs){
		if(!notifIDs){
			throw new Error('No notif ids to prepare data');
		}
		let returnArr = [];
		for(let i =0; i<notifIDs.length; i++){
			const notif = await newFollowerService.findById(notifIDs[i]);
			let user = await UserService.findById(notif.followerID);
			const data = {
				name: user.name,
				school: user.school,
				profilePictureURL: user.profilePictureURL,
				followerID: user._id,
			}
			returnArr.push(data);
		}
		return returnArr;
	}

	static async sendConnectionsFromNewAssNotification(userClass, user, assID){
		if(!userClass || !user || !assID){
			throw new Error('Missing new Assignment Notification data');
		}

		if(userClass.connectionsFrom.length <1){
			return;
		}

		for(let i =0; i<userClass.connectionsFrom.length; i++){
			const connection = userClass.connectionsFrom[i];
			const foundClass = await ClassService.findById(connection.class_data);
			const newNote = await ClassNoteService.createNewAssNotification(foundClass, user, userClass, assID);
			await UserService.postNewNotification(connection.user, newNote._id);
		}
	}

	static async deleteNewAssNotification(userID, noteID){
		if(!userID || !noteID){
			throw new Error('Missing userID or noteID for deleting notification');
		}
		ClassNoteService.deleteNewAssNotification(noteID);
		const user = await UserService.findById(userID);
		foundUser.notifications.academic.classNote.pull(noteID);
		foundUser.notifications.academic.unDismissed--;
		return await foundUser.save();
	}
}

module.exports = NotificationHandler;