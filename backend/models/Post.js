let mongoose = require('mongoose');

let PostSchema = mongoose.Schema({
	likes: Number,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
	text: String,
	photos: [{
		path: String
	}]
	//need to add date information
})

module.exports = mongoose.model('Post', PostSchema);