/*
Notification Design
	Notifications
		Academic
			Class
				Edited
				Deleted
				New class linked
				Assignment Added
			Assignment
				Edited
				Deleted
				Completed?
		Friends
		Messages
Class Notifications Walk through
	-What happens if Assignment was added to a linked class
		-Data needed:
				-Other user
				-Other user class???
				-Current user's class
				-Other user Assignment Data
*/

let mongoose = require('mongoose');

let ClassNotification = mongoose.Schema({
	wasDismissed: {type: Boolean, default: false},
	note_Data: String, //can either be 'Ass Added', 'Class Edited', 'Class Deleted', 'Ass Deleted'
	otherUserClass: {
		class_id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class"
		},
		class_name: String,
	},
	myClass: {
		class_id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class"
		},
		class_name: String,
	},
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
	assignment: { //only for 'Ass Added'
		type: mongoose.Schema.Types.ObjectId,
		ref: "Assignment"
	}
})

module.exports = mongoose.model('ClassNote', ClassNotification);