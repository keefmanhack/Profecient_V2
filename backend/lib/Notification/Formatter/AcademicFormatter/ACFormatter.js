const acFormatMap = require('./formatMap');

const UserService = require('../../../User/index');
const NotificationService = require('../../index');

const Formatter = require('../formatter');

class ACFormatter{
    constructor(userID){
        this.userID = userID;
    }
    format = async () => {
        const user = await UserService.findById(this.userID);
        const notifs = await NotificationService.findById(user.notifications.academic.notifBucket);
        return await Formatter.format(notifs, acFormatMap);
    }
}

module.exports = ACFormatter;