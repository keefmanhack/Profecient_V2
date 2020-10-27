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
	followers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}],
	following: [{
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
			unDismissed: {type: Number, default: 0},
			classNote: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: "ClassNote"
			}]
		},
		relations: {
			unDismissed: {type: Number, default: 0},
			notifBucket: {type: mongoose.Schema.Types.ObjectId, ref: 'Notifications'},
		},
		messages: {
			unDismissed: {type: Number, default: 0},
			messageNote: [{
				type: mongoose.Schema.Types.ObjectId,
				ref: "MessageNote",
			}]
		}
	}


})

module.exports = mongoose.model('User', UserSchema);