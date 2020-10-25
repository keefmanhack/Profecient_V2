const BaseRequests = require('../BaseServiceRequests');

const getUserStreams = Message => async streamIds => {
	if(!streamIds){
		return [];
	}
	const streams =  await Message.find({_id: streamIds}).populate('communicators');
	const sortedMessageStreams = streams.slice().sort((a,b) => b.sentMessages[b.sentMessages.length-1].date-a.sentMessages[a.sentMessages.length-1].date);
	return sortedMessageStreams;
}

const getStreamsWOutPopComms = Message => async streamIds =>{
	if(!streamIds){
		return [];
	}
	return await Message.find({_id: streamIds});
}

const updateStream = Message => async (streamID, newMessage) => {
	if(!streamID){
		throw new Error('No streamID');
	}
	const stream = await Message.findById(streamID);
	stream.sentMessages.push(newMessage);
	return await stream.save();
}

module.exports = Message => {
	return {
		getUserStreams: getUserStreams(Message),
		updateStream: updateStream(Message),
		findStream: BaseRequests.findById(Message),
		createNewStream: BaseRequests.create(Message),
		getStreamsWOutPopComms: getStreamsWOutPopComms(Message),
	}
}