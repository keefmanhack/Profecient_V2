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
	currentSemesterID: mongoose.Schema.Types.ObjectId,
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
	}]


})


module.exports = mongoose.model('User', UserSchema);