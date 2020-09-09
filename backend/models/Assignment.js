let mongoose = require('mongoose');

let AssignmentSchema = mongoose.Schema({
	name: String,
	dueDate: Date,
	dueTime: String,
	description: String,
})

module.exports = mongoose.model('Assignment', AssignmentSchema);