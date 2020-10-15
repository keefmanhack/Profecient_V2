const ClassService        = require('../Class/index'),
	  ClassNoteService    = require('../Notification/Class/index'),
	  UserService         = require('../User/index');

class NotificationHandler{
	static async sendConnectionsFromNewAssNotification(userClass, user, assID){
		try{
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
		}catch(err){
			console.log(err);
		}
	}

	static async deleteNewAssNotification(userID, noteID){
		try{
			if(!userID || !noteID){
				throw new Error('Missing userID or noteID for deleting notification');
			}
			ClassNoteService.deleteNewAssNotification(noteID);
			const user = await UserService.findById(userID);
			foundUser.notifications.academic.classNote.pull(noteID);
			foundUser.notifications.academic.unDismissed--;
			return await foundUser.save();
		}catch(err){
			console.log(err);
		}
	}

	// static sendNewAssNotification(userToBeNotifiedID, noteID){
	// 	User.findById(userToBeNotifiedID, function(err, foundUser){
	// 		if(err){
	// 			console.log(err);
	// 		}else{
	// 			foundUser.notifications.academic.unDismissed++;
	// 			foundUser.notifications.academic.classNote.unshift(noteID);
	// 			foundUser.save();
	// 			console.log('Notification posted for user ' + foundUser.name);
	// 		}
	// 	})
	// }

	// static deleteNewAssNotification(userID, noteID, cb){
	// 	User.findById(userID, function(err, foundUser){
	// 		if(err){
	// 			console.log(err);
	// 		}else{
	// 			ClassNote.findByIdAndRemove(noteID, function(err){
	// 				if(err){
	// 					console.log(err);
	// 				}else{
	// 					foundUser.notifications.academic.classNote.pull(noteID);
	// 					foundUser.notifications.academic.unDismissed--;
	// 					foundUser.save(function(err){
	// 						if(err){
	// 							console.log(err);
	// 						}else{
	// 							console.log('Notification deleted for ' + foundUser.name); 
	// 							cb();
	// 						}
	// 					})
	// 				}
	// 			})
	// 		}
	// 	})
	// }
}

module.exports = NotificationHandler;