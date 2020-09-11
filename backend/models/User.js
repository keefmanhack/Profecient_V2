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
	messages: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Message"
	}],
	agenda: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Agenda" //not yet created
	}]


})


module.exports = mongoose.model('User', UserSchema);