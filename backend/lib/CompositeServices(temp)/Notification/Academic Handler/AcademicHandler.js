const ClassService         = require('../Class/index'),
	  NewAssignmentService = require('../Notification/Categories/Academic/New Assignment/index'),
	  NotificationService  = require('../Notification/index'),
	  UserService          = require('../User/index'),
	  AssignmentService    = require('../Assignment/index');
class AcademicHandler{


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

}

module.exports = AcademicHandler;