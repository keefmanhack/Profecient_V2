let mongoose = require('mongoose');

const NewFollowerSchema = mongoose.Schema({
	followerID: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
	timeStamp: {type: Date, default: new Date()}
})

module.exports = mongoose.model('NewFollower', NewFollowerSchema);