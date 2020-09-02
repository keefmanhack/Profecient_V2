let mongoose = require('mongoose');

let PostSchema = mongoose.Schema({
	likes: {type: Number, default: 0},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}],
	text: String,
	photos: [String],
	date: {type: Date, default: Date.now}

})

module.exports = mongoose.model('Post', PostSchema);