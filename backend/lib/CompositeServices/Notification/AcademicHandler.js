const ClassService        = require('../../Class/index'),
	  ClassNoteService    = require('../../Notification/Class/index'),
	  UserService         = require('../../User/index');
class AcademicHandler{
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

module.exports = AcademicHandler;