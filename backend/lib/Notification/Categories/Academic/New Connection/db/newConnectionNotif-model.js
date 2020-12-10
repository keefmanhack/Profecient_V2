let mongoose = require('mongoose');

let NewConnectionNotification = mongoose.Schema({
    classID: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
    connectedClassID: {type: mongoose.Schema.Types.ObjectId, ref: 'Class'},
    connectedUserID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	timeStamp: {default: new Date(), type: Date}
})

module.exports = mongoose.model('NewConnection', NewConnectionNotification);