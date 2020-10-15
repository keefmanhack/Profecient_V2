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

	static async postNotification(myId, mostRecentStreamID){
		const user = await UserService.findById(myId);
		const stream = await MessageService.findStream(mostRecentStreamID);
		for(let i =0; i< stream.communicators.length; i++){
			let comm = stream.communicators[i];
			if(comm !== myId){
				const streamID = await this.findStreamsToNotify(stream.communicators, comm);
				const userToBeNotified =  await UserService.findById(comm);
				const noteID = otherUserHasNotification(userToBeNotified, streamID);
				if(noteID){
					MsgNoteService.incrementNote(noteID, stream.sentMessages[0]);
				}else{
					const data = {
						unReadMessages: 1,
						messageStreamID: streamID,
						lastMessage: stream.sentMessages[0],
						otherUser: {
							user_id: user._id,
							user_information: {
								name: user.name,
								school: user.school,
								profilePictureURL: name.profilePictureURL,
							}
						}
					}
					const newNote = await MsgNoteService.create(data);
					userToBeNotified.notifications.messages.push(newNote);
					userToBeNotified.save();
				}
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

	static async findStreamsToNotify(myId, stream){
		let returnStreams =[];
		const mySortedComms = stream.communicators.sort();
		for(let i =0; i< stream.communicators.length; i++){
			if(stream.communicators[i] != myId){
				const comm = await UserService.findById(stream.communicators[i]);
				const otherUserStreams = await MessageService.getStreamsWOutPopComms(comm.messageStreams);
				for(let j =0; j<otherUserStreams.length; j++){
					const otherUserStream = otherUserStreams[j];
					const otherUserSortedComms = otherUserStream.communicators.sort();
					if(mySortedComms + "" === otherUserSortedComms + ""){
						returnStreams.push(otherUserStream._id);
						break;
					}
				}
			}
		}
		return returnStreams;
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

module.exports = MessageHandler;