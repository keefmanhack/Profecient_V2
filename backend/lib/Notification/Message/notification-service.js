const getMultiple = Notification => async ids =>{
	if(!ids){
		throw new Error(`No ID: ${notifcationIDs}`);
	}

	const notifs = await Notification.find({_id: ids});
	return notifs;
}

const create = Notification => async (data) => {
	if(!data){
		throw new Error("No data supplied to create notification");
	}
	return await Notification.create(data);
}

const remove = Notification => async id =>{
	if(!id){
		throw new Error("no id supplied to delete a notification");
	}
	return await Notification.findByIdAndRemove(id);
}

const update = Notification => async (id, data) =>{
	if(!id || !data){
		throw new Error("No data or id supplied to update a notification");
	}
	return await Notification.findByIdAndUpdate(id, data);
}

const incrementNote = Notification => async (id, lastMessage) => {
	if(!id || !lastMessage){
		throw new Error('No message');
	}
	const note = await Notification.findById(id);
	note.lastMessage = lastMessage;
	note.unReadMessages++;
	return await note.save();
}


module.exports = Notification => {
	return{
		getMultiple: getMultiple(Notification),
		create: create(Notification),
		incrementNote: incrementNote(Notification),
		update: update(Notification),
		remove: remove(Notification),
	}
}