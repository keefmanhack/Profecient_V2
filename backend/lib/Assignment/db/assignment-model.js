let mongoose = require('mongoose');

let AssignmentSchema = mongoose.Schema({
	name: String,
	dueDate: Date,
	dueTime: Date,
	description: String,
	complete: {type: Boolean, default: false},
	created: {type: Date, default: new Date()}
})

module.exports = mongoose.model('Assignment', AssignmentSchema);