let mongoose = require('mongoose');


let UserSchema = mongoose.Schema({
	// username: {type: String, unique:true, required: true},
	// password: String,
	name: String,
	school: {
		name: String,
		logoUrl: String,
	},
	email: String, //{type: String, unique: true, required: true}
	profilePictureURL: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	totalLinks: {type: Number, default: 0},
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	}],
	semesters: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Semester"
	}],
	friends: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}],
	messageStreams: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "MessageStream"
	}],
	agenda: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Agenda" //not yet created
	}],
	notifications: {
		academic: {
			unDismissed: Number,
			class_data: {
				data: [{
					myClass: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "Class"
					},
					otherUser: {
						name: String,
						profilePictureURL: String,
					},
					assignment: {
						type: mongoose.Schema.Types.ObjectId,
						ref: "Assignment"
					},
					type: String, //options: 'New Ass, Edited, Deleted'
				}]
			}
			
		}
	}


})


module.exports = mongoose.model('User', UserSchema);