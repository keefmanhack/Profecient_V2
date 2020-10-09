let mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
	author:{ 
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	text: String,
	date: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Comment', commentSchema);