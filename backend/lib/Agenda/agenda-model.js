let mongoose = require('mongoose');

let AgendaSchema = mongoose.Schema({
	name: String,
	location: String,
	description: String,
	time: {
		start: Date,
		end: Date,
	},
	date: Date,
})

module.exports = mongoose.model('Agenda', AgendaSchema);