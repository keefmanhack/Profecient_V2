let mongoose = require('mongoose');

const PostBucket = mongoose.Schema({
	postID: { type: mongoose.Schema.Types.ObjectId, ref: "Post"},
	newLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
	newComments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
	timeStamp: {type: Date, Default: new Date()}
})

module.exports = mongoose.model('PostBucket', PostBucket);