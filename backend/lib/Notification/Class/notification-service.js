const getNotifications = Notification => async notifcationIDs =>{
	if(!notifcationIDs){
		throw new Error(`No ID: ${notifcationIDs}`);
	}

	const notifs = await Notification.findById(notifcationIDs);
	return notifs;
}

const deleteNotification = Notification => notifcationID => {
	if(!notifcationID){
		throw new Error(`No ID: ${notifcationIDs}`);
	}
	Notification.findByIdAndRemove(notifcationID);
}

const createNewAssNotification = Notification => async (usersClassToBeNotified, userNotifing, userNotifingClass, notifingUserAssignmentID) => {
	if(!usersClassToBeNotified || !userNotifing || !userNotifingClass || !notifingUserAssignmentID){
		throw new Error('Missing Notification data');
	}
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
	return await Notification.create(note);
}

module.exports = Notification => {
	return{
		getNotifications: getNotifications(Notification),
		deleteNotification: deleteNotification(Notification),
		createNewAssNotification: createNewAssNotification(Notification)
	}
}