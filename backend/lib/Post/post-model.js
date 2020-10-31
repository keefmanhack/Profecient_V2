let mongoose = require('mongoose');

let PostSchema = mongoose.Schema({
	likes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		default: [],
	}],
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment",
		default: [],
	}],
	text: String,
	photos: [String],
	date: {type: Date, default: Date.now},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	notifBucketID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "PostBucket"
	}

})

module.exports = mongoose.model('Post', PostSchema);