let User       = require('../models/User'),
    ClassNote = require('../models/ClassNote');

class NotificationHandler{
	static sendNewAssNotification(userToBeNotifiedID, noteID){
		User.findById(userToBeNotifiedID, function(err, foundUser){
			if(err){
				console.log(err);
			}else{
				foundUser.notifications.academic.unDismissed++;
				foundUser.notifications.academic.classNote.unshift(noteID);
				foundUser.save();
				console.log('Notification posted for user ' + foundUser.name);
			}
		})
	}

	static createNewAssNotification(usersClassToBeNotified, userNotifing, userNotifingClass, notifingUserAssignmentID, cb){
		//myClass
		//Me
		//otherUser class
		//my assignmentID
		const note = {
			note_Data: "Ass Added",
			otherUserClass: {
				class_id: userNotifingClass._id,
				class_name: userNotifingClass.name
			},
			myClass: {
				class_id: usersClassToBeNotified._id,
				class_name: usersClassToBeNotified.name,
			},
			otherUser: {
				user_id: userNotifing._id,
				user_information: {
					name: userNotifing.name,
					school: userNotifing.school,
					profilePictureURL: userNotifing.profilePictureURL,
				}
			},
			assignment: notifingUserAssignmentID,
		}
		ClassNote.create(note, function(err, newNote){
			if(err){
				console.log(err);
			}else{
				console.log('New Notification Created');
				cb(newNote)
			}
		})
	}

	static deleteNewAssNotification(userID, noteID, cb){
		User.findById(userID, function(err, foundUser){
			if(err){
				console.log(err);
			}else{
				ClassNote.findByIdAndRemove(noteID, function(err){
					if(err){
						console.log(err);
					}else{
						foundUser.notifications.academic.classNote.pull(noteID);
						foundUser.notifications.academic.unDismissed--;
						foundUser.save(function(err){
							if(err){
								console.log(err);
							}else{
								console.log('Notification deleted for ' + foundUser.name); 
								cb();
							}
						})
					}
				})
			}
		})
	}
}

module.exports = NotificationHandler;