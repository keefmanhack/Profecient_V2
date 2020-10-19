const MessageService      = require('../Message/index'),
	  UserService         = require('../User/index'),
	  MsgNoteService      = require('../Notification/Message/index');

class MessageHandler{
	static async handleNewMessage(msgData){
		const communs = await UserService.findMultiple(msgData.communicators);
		let usersWithOutStream = await this.handleUsersWithStream(communs, msgData, msgData.communicators);

		if(usersWithOutStream.length > 0){
			await this.handleUsersWithOutStream(usersWithOutStream, msgData);
		}
	}

	static async sendMessageToCommunicators(myId, streamID, newMessage){
		const stream = await MessageService.findStream(streamID);
		for(let i =0; i<stream.communicators.length; i++){
			if(stream.communicators[i] !== myId){
				const foundCommun = await UserService.findById(stream.communicators[i]);
				const foundStreamID = await this.findStreamToNotify(stream.communicators, foundCommun);
				if(foundStreamID){
					MessageService.updateStream(foundStreamID, newMessage);
				}else{
					const data = {
						communicators: stream.communicators,
						sentMessages: [newMessage],
					}
					const newStream = await MessageService.create(data);
					foundCommun.messageStreams.push(newStream);
					foundCommun.save();
				}
			}
		}
		//search each communicators stream (that isn't me)
		//look through stream to find matching communicators
		//if not found, create a new stream for the other communicators
		//else update the stream with the new message
	}

	static async postNotification(myId, mostRecentStreamID){
		const user = await UserService.findById(myId);
		const stream = await MessageService.findStream(mostRecentStreamID);
		stream.communicators.pull(myId);
		for(let i =0; i< stream.communicators.length; i++){
			if(stream.communicators[i] !== myId){
				const userToBeNotified =  await UserService.findById(stream.communicators[i]);
				const streamID = await this.findStreamToNotify(stream.communicators, userToBeNotified);
				const noteID = otherUserHasNotification(userToBeNotified, streamID);
				let note;
				if(noteID){
					note = await MsgNoteService.incrementNote(noteID, stream.sentMessages[stream.sentMessages.length-1].message);
				}else{
					const data = {
						messageStreamID: streamID,
						lastMessage: stream.sentMessages[stream.sentMessages.length-1].message,
						otherUser: {
							user_id: user._id,
							user_information: {
								name: user.name,
								school: user.school,
								profilePictureURL: user.profilePictureURL,
							}
						}
					}
					note = await MsgNoteService.create(data);
					userToBeNotified.notifications.messages.messageNote.push(note);
				}

				userToBeNotified.notifications.messages.unDismissed++;
				userToBeNotified.save();
				return note;
			}
		}
	}


	//private functions
	static async findNotification(userToBeNotified, streamID){
		const notifications =  await MsgNoteService.findMultiple(userToBeNotified.notifications.messages);
		for(let i =0; i< notifications.length; i++){
			if(notifications[i].streamID === streamID){
				return notifications[i]._id;
			}
		}
	}

	static async findStreamToNotify(myStreamCommunicatorIDs, currCommunicator){
		myStreamCommunicatorIDs.sort();
		for(let i =0; i<currCommunicator.messageStreams.length; i++){
			const stream = await MessageService.findStream(currCommunicator.messageStreams[i]);
			if(sameCommunicators(myStreamCommunicatorIDs, stream.communicators)){
				return currCommunicator.messageStreams[i];
			}
		}
	}

	static async handleUsersWithStream(communs, msgData, communsIDs){
		let usersWithOutStream = [];
		let streamID;
		for(let i =0; i<communs.length; i++){
			const comm = communs[i];

			const commStreams = await MessageService.getStreamsWOutPopComms(comm.messageStreams);
			streamID = doesStreamExist(commStreams, communsIDs);
			if(streamID){
				await MessageService.updateStream(streamID, msgData);
			}else{
				usersWithOutStream.push(comm);
			}
		}
		return usersWithOutStream;
	}

	static async handleUsersWithOutStream(usersWithOutStream, msgData){
		const newStream = await MessageService.createNewStream(msgData);
		for(let i =0; i< usersWithOutStream.length; i++){
			const user = usersWithOutStream[i];
			user.messageStreams.push(newStream);
			await user.save();
		}
	}
}

function doesStreamExist(messageStreams, communicators){
	const newComms = communicators;
	newComms.sort();
	for(let i =0; i< messageStreams.length; i++){
		if(messageStreams[i].communicators.length === newComms.length){
			let found = true;
			const prevComms = messageStreams[i].communicators.sort();
			for(let j =0; j< prevComms.length; j++){
				if(prevComms[j] != newComms[j]){
					found=false;
				}
			}
			if(found){
				return messageStreams[i]._id;
			}
		}
	}
	return null
}

function sameCommunicators(communsToMatchSorted, otherUserCommuns){
	if(communsToMatchSorted.length !== otherUserCommuns.length){return;}

	let found = true;
	for(let i =0; i<otherUserCommuns.length; i++){
		otherUserCommuns.sort();
		if(communsToMatchSorted[i] + "" !== otherUserCommuns[i] + ""){
			found = false;
		}
	}
	return found;
}

function otherUserHasNotification(user, streamID){
	for(let i =0; i<user.notifications.messages.messageNote.length; i++){
		const note = user.notifications.messages.messageNote[i];
		if(note === streamID){
			return note;
		}
	}
	return null;
}

module.exports = MessageHandler;