const BaseRequests = require('../../../../../BaseServiceRequests');

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
		findById: BaseRequests.findById(Notification),
		deleteById : BaseRequests.deleteById(Notification),
		create: BaseRequests.create(Notification),

		createNewAssNotification: createNewAssNotification(Notification)
	}
}