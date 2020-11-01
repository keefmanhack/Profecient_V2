const ClassService         = require('../../../Class/index'),
	  NewAssignmentService = require('../../../Notification/Categories/Academic/New Assignment/index'),
	  NotificationService  = require('../../../Notification/index'),
	  UserService          = require('../../../User/index'),
	  AssignmentService    = require('../../../Assignment/index');
class AcademicHandler{
	static async addNewConnection(classIDRec, userIDRec, classIDRequ, userIDRequ){
		if(!classIDRec || !userIDRec || !classIDRec || !userIDRec){
			throw new Error('Missing data to add a new connection');
		}
		await ClassService.addConnectionFrom(classIDRec, classIDRequ, userIDRequ);
		await ClassService.addConnectionTo(classIDRequ, classIDRec, userIDRec);
	}

	static async newAssignment(userID, classID, assData){
		const newAss = await AssignmentService.create(assData);
		const updatedClass = await ClassService.addAssignment(classID, newAss);
		const notifStruct = {assignmentID: newAss._id, ownerID: userID, parentClassID: updatedClass._id}
		for(let i =0; i< updatedClass.connectionsFrom.length; i++){
			const connection = updatedClass.connectionsFrom[i];
			const foundUser = await UserService.incrementNotifCt(connection.userID, UserService.notifCategories.academic);
			const newAssignmentNotif = await NewAssignmentService.create(notifStruct);
			await NotificationService.insertItem(foundUser.notifications.academic.notifBucket, newAssignmentNotif);

		}
		return newAss;
	}

	static async removeNotification(userID, newAssNotifID){
		await NewAssignmentService.deleteById(newAssNotifID);
		const user = await UserService.decrementNotifCt(userID, UserService.notifCategories.academic);
		await NotificationService.removeItemByToId(user.notifications.academic.notifBucket, newAssNotifID);
	}
	// static async sendConnectionsFromNewAssNotification(userClass, user, assID){
	// 	if(!userClass || !user || !assID){
	// 		throw new Error('Missing new Assignment Notification data');
	// 	}

	// 	if(userClass.connectionsFrom.length <1){
	// 		return;
	// 	}

	// 	for(let i =0; i<userClass.connectionsFrom.length; i++){
	// 		const connection = userClass.connectionsFrom[i];
	// 		const foundClass = await ClassService.findById(connection.class_data);
	// 		const newNote = await ClassNoteService.createNewAssNotification(foundClass, user, userClass, assID);
	// 		await UserService.postNewNotification(connection.user, newNote._id);
	// 	}
	// }

	// static async deleteNewAssNotification(userID, noteID){
	// 	if(!userID || !noteID){
	// 		throw new Error('Missing userID or noteID for deleting notification');
	// 	}
	// 	ClassNoteService.deleteNewAssNotification(noteID);
	// 	const user = await UserService.findById(userID);
	// 	foundUser.notifications.academic.classNote.pull(noteID);
	// 	foundUser.notifications.academic.unDismissed--;
	// 	return await foundUser.save();
	// }
}

module.exports = AcademicHandler;