let mongoose = require('mongoose');

let ClassSchema = mongoose.Schema({
	name: String,
	location: String,
	instructor: String,
	time: {
		start: String,
		end: String
	},
	date: {
		start: Date,
		end: Date,
	},
	weekDays: Array,
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