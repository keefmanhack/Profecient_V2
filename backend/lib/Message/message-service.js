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

const updateStream = Message => async (streamID, updatedStream) => {
	if(!streamID){
		throw new Error('No streamID');
	}
	await Message.findByIdAndUpdate(streamID, updatedStream);
}

const findStream = Message => async id => {
	if(!id){
		throw new Error('No message id');
	}
	return await Message.findById(id);
}

const createNewStream = Message => async data =>{
	if(!data){
		throw new Error("no data supplied to create a new message");
	}
	return await Message.create(data);
}

module.exports = Message => {
	return {
		getUserStreams: getUserStreams(Message),
		updateStream: updateStream(Message),
		findStream: findStream(Message),
		createNewStream: createNewStream(Message),
		getStreamsWOutPopComms: getStreamsWOutPopComms(Message),
	}
}