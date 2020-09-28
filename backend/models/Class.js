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
	connectionsTo: [{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		class_data: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class"
		}
	}],
	conectionsFrom: [{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		class_data: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Class"
		}
	}],
	assignments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Assignment"
	}]
})

module.exports = mongoose.model('Class', ClassSchema);