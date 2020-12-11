const NotificationService = require('../../index'),
      UserService = require('../../../User/index');

class AcademicNotification{
    constructor(userID){
        this.userID = userID;
    }

    push = async notif =>{
        try{
            let bucket = await this.getBucket();
            bucket.list.push({to: notif, onModel: notif.constructor.modelName});
            bucket = await bucket.save();
            await this.increment();
            return {success: true, bucket: bucket};
        }catch(err){
            console.log(err);
            return {success: false, error: 'Unknown error adding academic notification'}
        }
    }

    increment = async () => {
        try{
            let user = await UserService.findById(this.userID);
            user.notifications.academic.unDismissed++;
            user = await user.save();
            return {success: true, user: user}
        }catch(err){
            console.log(err);
            return {success: false, error: 'Unknown error incrementing academic notification'}
        }
    }

    getBucket = async () =>{
        const user = await UserService.findById(this.userID);
        const bucket = await NotificationService.findById(user.notifications.academic.notifBucket);
        return bucket;
    }
}

module.exports = AcademicNotification;