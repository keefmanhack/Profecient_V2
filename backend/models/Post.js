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
	}],
	date: {type: Date, default: Date.now}

})

module.exports = mongoose.model('Post', PostSchema);