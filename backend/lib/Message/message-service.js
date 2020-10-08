const getUserStreams = Message => async streamIds => {
	if(!streamIds){
		return [];
	}
	const streams =  await Message.find({_id: streamIds}).populate('communicators');
	const sortedMessageStreams = streams.slice().sort((a,b) => b.sentMessages[b.sentMessages.length-1].date-a.sentMessages[a.sentMessages.length-1].date);
	return sortedMessageStreams;
}

const updateStream = Message => async (streamID, updatedStream) => {
	if(!streamID){
		throw new Error('No streamID');
	}
	await Message.findByIdAndUpdate(streamID, updateStream);
}

const findStream = Message => async id => {
	if(!id){
		throw new Error('No message id');
	}
	return await Message.findById(id);
}

module.exports = Message => {
	return {
		getUserStreams: getUserStreams(Message),
		updateStream: updateStream(Message),
		findStream: findStream(Message),
	}
}