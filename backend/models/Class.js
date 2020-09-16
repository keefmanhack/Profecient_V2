let mongoose = require('mongoose');

let ClassSchema = mongoose.Schema({
	name: String,
	location: String,
	instructor: String,
	time: {
		start: Date,
		end: Date,
	},
	date: {
		start: Date,
		end: Date,
	},
	daysOfWeek: Array,
	links: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Link"
	}],
	assignments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Assignment"
	}]
})

module.exports = mongoose.model('Class', ClassSchema);