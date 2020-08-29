let mongoose = require('mongoose');

let MessageSchema = mongoose.Schema({
	to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	unReadMessages: Number,
	messageData: [{
		date: Date,
		fromCorrespondent: Boolean,
		message: String,
	}]
})

module.exports = mongoose.model('Message', MessageSchema);