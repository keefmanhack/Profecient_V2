const ClassService         = require('../../Class/index'),
	  NewAssignmentService = require('../Notification/Categories/Academic/New Assignment/index'),
	  NotificationService  = require('../../Notification/index'),
	  UserService          = require('../../User/index'),
	  AssignmentService    = require('../db/__test__/index');
class AssignmentHandler{

	static async new(userID, classID, assData){
		try{
			const newAssignment = await AssignmentService.create(assData);
			const updatedClass = await ClassService.addAssignment(classID, newAssignment._id);
	
			//dispatch notification
			const NewAssNotif = new NewAssignmentNotif(userID);
			await NewAssNotif.push(res.newAssignment._id, updatedClass);
	
			return {success: true, newAssignment: newAssignment};
		}catch(err){
			console.log(err);
			return {success: false, error: 'Error creating new assignment'}
		}
	}

	// static async removeNotification(userID, newAssNotifID){
	// 	await NewAssignmentService.deleteById(newAssNotifID);
	// 	const user = await UserService.decrementNotifCt(userID, UserService.notifCategories.academic);
	// 	await NotificationService.removeItemByToId(user.notifications.academic.notifBucket, newAssNotifID);
	// }

}

module.exports = AssignmentHandler;