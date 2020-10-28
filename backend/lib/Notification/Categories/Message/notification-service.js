const BaseRequests = require('../../../BaseServiceRequests');

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
		getMultiple: BaseRequests.findMultipleById(Notification),
		create: BaseRequests.create(Notification),
		remove: BaseRequests.deleteById(Notification),
		update: BaseRequests.update(Notification),

		incrementNote: incrementNote(Notification),
	}
}