let mongoose = require('mongoose');

const PostBucket = mongoose.Schema({
	postID: { type: mongoose.Schema.Types.ObjectId, ref: "Post"},
	lastLiker: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
	lastComment: {type: mongoose.Schema.Types.ObjectId, ref: "Comment"},
	timeStamp: {type: Date, default: new Date()}
})

module.exports = mongoose.model('PostBucket', PostBucket);