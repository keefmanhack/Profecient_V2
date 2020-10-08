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

module.exports = Notification => {
	return{
		getNotifications: getNotifications(Notification),
		deleteNotification: deleteNotification(Notification),
	}
}