let mongoose = require('mongoose');

let NewAssignmentNotification = mongoose.Schema({
	assignmentID: {type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'},
	ownerID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	parentClassID: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
	timeStamp: {default: new Date(), type: Date}
})

module.exports = mongoose.model('NewAssignment', NewAssignmentNotification);