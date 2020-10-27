let mongoose = require('mongoose');

let NotificationSchema = mongoose.Schema({
    list: [{
        to: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'list.onModel',
        },
        onModel: {
            type: String,
            required: true,
            enum: ['NewFollower', 'PostBucket']
        }
    }]
})

module.exports = mongoose.model('Notifications', NotificationSchema);