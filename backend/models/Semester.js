let mongoose = require('mongoose');

let SemesterSchema = mongoose.Schema({
	name: String,
	current: Boolean,
	classes:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Class"
	}]
})

module.exports = mongoose.model('Semester', SemesterSchema);