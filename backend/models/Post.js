let mongoose = require('mongoose');

let PostSchema = mongoose.Schema({
	likes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}],
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
	text: String,
	photos: [String],
	date: {type: Date, default: Date.now},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}

})

module.exports = mongoose.model('Post', PostSchema);