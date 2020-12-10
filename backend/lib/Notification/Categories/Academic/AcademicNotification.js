const NotificationService = require('../../index'),
      UserService = require('../../../User/index');

class AcademicNotification{
    constructor(userID){
        this.userID = userID;
    }

    push = async notif =>{
        const bucket = await this.getBucket();
        console.log(bucket);
        bucket.push(notif);
        bucket = await this.bucket.save();
        return bucket;
    }

    getBucket = async () =>{
        const user = await UserService.findById(this.userID);
        const bucket = await NotificationService.findById(user.notifications.academic.notifBucket);
        return bucket;
    }
}



module.exports = AcademicNotification;