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
	note_Data: String, //can either be 'Ass Added', 'Class Edited', 'Class Deleted', 'Class Added'
	otherUserClassID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Class"
	},
	myClassID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Class"
	},
	otherUserID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	assignmentID: { //only for 'Ass Added'
		type: mongoose.Schema.Types.ObjectId,
		ref: "Assignment"
	}
})

module.exports = mongoose.model('ClassNote', ClassNotification);