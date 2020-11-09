let mongoose = require('mongoose');
let passportLocalMongoose = require("passport-local-mongoose");


let UserSchema = mongoose.Schema({
	name: {type: String, required: true},
	username: {type: String, unique:true, required: true},
	school: {
		name: String,
		logoUrl: String,
	},
	email: {type: String, unique: true, required: true}, 
	phoneNumber: {type: Number, unique: true, require: true},
	profilePictureURL: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
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
		ref: "Agenda"
	}],
	notifications: {
		academic: {
			unDismissed: {type: Number, default: 0},
			notifBucket: {type: mongoose.Schema.Types.ObjectId, ref: 'Notifications'},
		},
		relations: {
			unDismissed: {type: Number, default: 0},
			notifBucket: {type: mongoose.Schema.Types.ObjectId, ref: 'Notifications'},
		},
		messages: {

		}
	},
	access_token: String,
	refresh_token: String,
})

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserSchema);