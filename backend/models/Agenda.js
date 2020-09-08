let mongoose = require('mongoose');

let AgendaSchema = mongoose.Schema({
	name: String,
	location: String,
	description: String,
	time: {
		start: String,
		end: String,
	},
	date: Date,

})

module.exports = mongoose.model('Agenda', AgendaSchema);