let mongoose = require('mongoose');

let ClassSchema = mongoose.Schema({
	link : {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Link"
	}
})

module.exports = mongoose.model('Link', ClassSchema);