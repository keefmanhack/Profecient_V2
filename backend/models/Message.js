let mongoose = require('mongoose');

let MessageSchema = mongoose.Schema({
	communicators: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	}],
	sentMessages: [{
		message: String,
		date: {type: Date, default: new Date()},
		read: {type: Boolean, default: false},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		}
	}]
})

module.exports = mongoose.model('MessageStream', MessageSchema);