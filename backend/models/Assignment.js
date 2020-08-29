let mongoose = require('mongoose');

let AssignmentSchema = mongoose.Schema({
	name: String,
	dueDate: String,
	description: String,
})

module.exports = mongoose.model('Assignment', AssignmentSchema);