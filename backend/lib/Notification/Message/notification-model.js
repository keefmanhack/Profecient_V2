let mongoose = require('mongoose');

let MessageNotification = mongoose.Schema({
	unReadMessages: Number,
	messageStreamID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "MessageStream"
	},
	lastMessage: String,
	otherUser: {
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		user_information:{
			name: String,
			school: Object,
			profilePictureURL: String,
		}
	},
})

module.exports = mongoose.model('MessageNote', MessageNotification);